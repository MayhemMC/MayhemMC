export default async function(args, message) {

	const { channel, member } = message;

	// Get args
	const [ query = null ] = args;

	// If not enough args
	if(query === null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc register <username>`")
	    return channel.send(embed);
	}

	// Look up user on namemc
	const { players } = await api("player", { query });

	// If there are no users
	if(players.length === 0) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`\`${name}\` is not a valid Minecraft account.`)
	    return channel.send(embed);
	}

	// Get player data
	const [ player ] = players;
	const { name, uuid, discord_id, has_joined } = player;

	// If player never joined the server
	if(!has_joined) {
		const embed = new MessageEmbed()
		embed.setColor(Color.ERROR)
		embed.setTitle("Can't register.")
		embed.setDescription(`${name} has never played on the server before, join our server to register.\nIP: \`mayhemmc.uk.to\``)
		return channel.send(embed);
	}

	// If target player is already registered
	if(discord_id !== null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't register.")
		embed.setDescription(`${name} is already registered as <@${discord_id}>.`)
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

	// Insert into database
	await mysql.query(`INSERT INTO discord_players (uuid, discordid) VALUES ("${uuid}", "${discordid}")`)

	// Give verified player role
	member.roles.add(Roles.VERIFIED)

	// Respond
	const embed = new MessageEmbed()
	embed.setColor(Color.SUCCESS)
	embed.setTitle("Registered.")
	embed.setDescription(`You have been registered as \`${name}\`.`)
	return channel.send(embed);

}
