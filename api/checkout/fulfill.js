import smtp from "nodemailer";
import { promises as fs } from "fs";
import markdown from "markdown-it";
import fetch from "node-fetch";

// Initialize stripe
import Stripe from "stripe";
const stripe = Stripe(config.stripe.secret_key);

// Do work
async function fulfill({ oldPlayer, prefix, purchase, charge, email, newRank, order }) {

	// Send commands
	await inject("lobby", `lp user ${oldPlayer.name} parent set ${purchase}`);
	await inject("bungee", `gbc &7Thank you &f${oldPlayer.name}&7 for supporting the server! You have received your ${prefix}&7rank!`);

	// Send message to joins
	const guildId = "708050277957238784";
	const guild = await client.guilds.fetch(guildId);
	(await client.channels.cache.get(Channels.JOINS)).send(`Thank you ${oldPlayer.discord_id === null ? `\`${oldPlayer.name}\``:`<@${oldPlayer.discord_id}>`} for supporting the server! You have received your ${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === purchase.toUpperCase())} __**\`${purchase.toUpperCase()}\`**__ rank!`)

	// Give player donator role
	if(oldPlayer.discord_id !== null) {
		const specimen = await guild.members.fetch(oldPlayer.discord_id);
		Object.values(Roles).map(role => specimen.roles.remove(role));
		specimen.roles.add(Roles[purchase.toUpperCase()]);
		specimen.roles.add(Roles.VERIFIED);
	}

	// Insert donation into donators database
	const [ donators ] = await mysql.query(`SELECT * FROM \`donations\` WHERE uuid="${oldPlayer.uuid}"`);
	if(donators.length === 0) {
		await mysql.query(`INSERT INTO \`donations\` (uuid, package, name) VALUES ("${oldPlayer.uuid}", "${purchase.toUpperCase()}", "${oldPlayer.name}")`);
	} else {
		await mysql.query(`UPDATE \`donations\` SET package="${purchase.toUpperCase()}", timestamp=NOW() WHERE uuid="${oldPlayer.uuid}"`);
	}

	// Get new player
	const newPlayer = (await api("player", { query })).players[0];

	// Email player receipt
	smtp.createTransport({
		service: "gmail",
		auth: {
			user: config.gmail.address,
			pass: config.gmail.password
		}
	}).sendMail({
		from: "Mayhem MC",
		to: [ email ],
		subject: "Webstore Receipt",
		html: `<center>${
			markdown({ html: true }).render((await fs.readFile("./docs/receipt.md", "utf8"))
			  .replace(/\%username\%/gm, newPlayer.name)
			  .replace(/\%uuid\%/gm, newPlayer.uuid)
			  .replace(/\%avatar\%/gm, newPlayer.avatar)
			  .replace(/\%thumbnail\%/gm, newRank.iconURL)
			  .replace(/\%product\%/gm, newRank.name)
			  .replace(/\%prefix\%/gm, prefix)
		    )
			  .replace(/\%receipt\%/gm, await fetch(charge.data[0].receipt_url).then(resp => resp.text()))
	  }</center>`
	});

	// Make sure order cant be redeemed twice
	await mysql.query(`UPDATE pending_transactions SET purchase="TXN_FULFILLED" WHERE txn="${order}"`);

	// Return new player object
	return newPlayer;

}

// API resolver
export default req => new Promise(async function(resolve, reject) {

	// Get order
	const order =
		(req.query !== undefined && (req.query.order)) ||
		(req.body !== undefined && (req.body.order));

	// If no order
	if(order === undefined || !order.match(/^[0-9a-f]{8}(-)?[0-9a-f]{4}(-)?[0-9a-f]{4}(-)?[0-9a-f]{4}(-)?[0-9a-f]{12}/g)) return reject("Invalid order");

	// Get order from database
	const [[ row ]] = await mysql.query(`SELECT * FROM pending_transactions WHERE txn="${order}"`);

	// If no row
	if(row === undefined) return reject("Invalid order");

	// Get props from row
	const { sessionId, player: query, purchase } = row;

	// If already redeemed
	if(purchase === "TXN_FULFILLED") return reject("Order expired");

	// Get session
	const session = await stripe.checkout.sessions.retrieve(sessionId);

	// Get charge
	const charge = await stripe.charges.list({ limit: 1, customer: session.customer });

	// Get email address
	const { email } = session.customer_details;

	// Save email address
	const [ rows ] = await mysql.query(`SELECT * FROM emails WHERE uuid="${query}"`);
	if(rows.length === 0) {
		await mysql.query(`INSERT INTO emails (uuid, email) VALUES ("${query}", "${email}")`);
	} else {
		await mysql.query(`UPDATE emails SET email="${email}" WHERE uuid="${query}"`);
	}

	// If not paid
	if(session.payment_status !== "paid") return reject("Not paid");

	// Get player
	const oldPlayer = (await api("player", { query })).players[0];

	// Get store
	const { packages } = await api("store");
	const newRank = packages.filter(({ name }) => name.toLowerCase() === purchase)[0]
	const { prefix } = newRank;

	// Fulfill user
	const newPlayer = await fulfill({ oldPlayer, prefix, purchase, charge, email, newRank, order });

	// Resolve API request
	resolve({ oldPlayer, email, paid: session.amount_total/100, newPlayer });

});
