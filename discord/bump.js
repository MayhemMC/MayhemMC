client.setInterval(async function() {

	// Get bumps channel
	const guild = await client.guilds.fetch("708050277957238784")
	const bumps = await guild.channels.resolve(Channels.BUMP)
	let messages = Object.values(parseCollection(await bumps.messages.fetch({ limit: 25 })));
	let lastMessage = messages[0];
	messages = messages.filter(message => message.author.id === "302050872383242240");
	messages = messages.filter(message => message.embeds[0].color === 2406327);
	messages = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0];

	// If a bumps ISNT available cancel action
	if(lastMessage.author.id === "709480797781885000") return;
	if(messages !== undefined && Date.now() < messages.createdTimestamp + 2*60*60*1000) return;

	// Send bump message
	await bumps.send(`A bump is now available for this server. Do \`!d bump\``);

}, 5000);
