import { stripFormats } from "minecraft-text";

// Initialize stripe
import Stripe from "stripe";
const stripe = Stripe(config.stripe.secret_key);

export default req => new Promise(async function(resolve) {

	// Get packages
	const { packages } = await api("store");

	// Get player
	let player = (
		(req.query !== undefined && (req.query.player)) ||
		(req.body !== undefined && (req.body.player)));
	player = (await api("player", { query: player })).players[0];

	// Get rank
	let rank = (
		(req.query !== undefined && (req.query.rank)) ||
		(req.body !== undefined && (req.body.rank)))
	rank = packages.filter(({ name }) => name.toLowerCase() === rank.toLowerCase())[0]

	// Get package price
	const price = (rank.price - (player.donator === null ? 0 : packages.filter(({ name }) => name.toLowerCase() === player.donator.package.toLowerCase())[0].price)) * 100;

	// Await payment gateway
	const session = await stripe.checkout.sessions.create({
	    payment_method_types: [ "card" ],
	    line_items: [{
	        price_data: {
	          	currency: "usd",
	          	product_data: {
	            	name: `${stripFormats(rank.prefix, "&")} Rank`,
	            	images: [ rank.iconURL ],
	          	},
	          	unit_amount: price,
	        },
	        quantity: 1,
	    }],
	    mode: "payment",
	    success_url: `https://mayhemmc.uk.to/store`,
	    cancel_url: `https://mayhemmc.uk.to/store`,
	});

	// Resolve API
	resolve({ id: session.id, price, rank, player: player.uuid, public_key: config.stripe.public_key });

});
