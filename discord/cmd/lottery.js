export default async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Get votes
	const { votes } = await api("votes", { limit: -1 });

	// Convert to list of drawable names
	let drawpool = [];
	votes.map(({ amount, uuid }) => drawpool = [ ...drawpool, ...Array(amount).fill(uuid) ]);

	// Select user
	let user;
	(async function draw() {
		const uuid = drawpool[Math.floor(Math.random() * drawpool.length)];
		[ user ] = (await api("player", { query: uuid })).players;
		if(user.administrator) draw();
		if(user.discord_id === false) draw();
		else proceed(user);
	}());

	// After a user is called
	async function proceed(user) {

		// Send message to joins
		await client.channels.cache.get(Channels.JOINS).send(`Thank you <@${user.discord_id}> for voting this month. You have won this months vote lottery. Because you voted ${user.votes.amount} times, you had a ${Math.floor(user.votes.amount/drawpool.length * 1000)/10}% chance of winning. DM an admin for your vote reward! Thank you all for voting this month. Please continue to vote for **Mayhem MC**!`)

		// Clear database
		await mysql.query(`TRUNCATE votes`);

	}

}
