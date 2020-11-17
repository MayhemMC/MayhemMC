module.exports = async function(args, message) {

	const { channel, member } = message;

	// Get discord id
	const discordid = member.id;

	// If user isnt registered
	if((await mysql.query(`SELECT * FROM discord_players WHERE discordid="${discordid}"`))[0].length === 0) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't unregister.")
		embed.setDescription(`You are not registered.`)
	    return channel.send(embed);
	}

	// Insert into database
	await mysql.query(`DELETE FROM discord_players WHERE discordid="${discordid}"`);

	// Remove verified player role
	member.roles.remove(Roles.VERIFIED)

	// Respond
	const embed = new MessageEmbed()
	embed.setColor(Color.SUCCESS)
	embed.setTitle("Unregistered.")
	embed.setDescription(`You have been unregistered.`)
	return channel.send(embed);

}
