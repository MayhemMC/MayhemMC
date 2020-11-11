module.exports = async function(args, message) {

	const { channel, member } = message;

	// Get args
	const [ username = null ] = args;

	// If not enough args
	if(username === null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc register <username>`")
	    return channel.send(embed);
	}

	const results = await namemc.lookupName(username).catch(() => []);

	if(results.length === 0) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`\`${username}\` is not a valid Minecraft account.`)
	    return channel.send(embed);
	}

	// Get player data
	const [{ currentName, uuid }] = results;

	// If player never joined the server
	if(await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${uuid}.yml`)).then(() => false).catch(() => true)) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`\`${currentName}\` has never joined the server before.`)
	    return channel.send(embed);
	}

	// Get discord id
	const discordid = member.id;

	// If user is already registered
	if((await mysql.query(`SELECT * FROM discord_players WHERE discordid="${discordid}"`))[0].length !== 0) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`You are already registered.`)
	    return channel.send(embed);
	}

	// If target is already registered
	if((await mysql.query(`SELECT * FROM discord_players WHERE uuid="${uuid}"`))[0].length !== 0) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`\`${currentName}\` has already registered as someone else.`)
	    return channel.send(embed);
	}

	// Insert into database
	await mysql.query(`INSERT INTO discord_players (uuid, discordid) VALUES ("${uuid}", "${discordid}")`)

	// Give verified player role
	member.roles.add(Roles.VERIFIED)

	// Respond
	const embed = new MessageEmbed()
	embed.setColor(Color.SUCCESS)
	embed.setTitle("Registered.")
	embed.setDescription(`You have been registered as \`${currentName}\`.`)
	return channel.send(embed);

}
