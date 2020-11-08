module.exports = async function(args, message) {

	const { channel, member } = message;

	// Formulate embed object
    const embed = new MessageEmbed()
    embed.setColor("#1976d4")
    embed.setTitle("Mayhem MC Commands")
    if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.MOD)) embed.addField("Restart", `Usage: \`mmc restart <server> (delay = 15s)\`\nQueues a server restart **(Moderator only)**.\n`)
    if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) embed.addField("Redeem", `Usage: \`mmc redeem <token>\`\nRedeem a rank from the web store **(Owner only)**.\n`)
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.VERIFIED)) embed.addField("Register", `Usage: \`mmc register <username>\`\nRegisters your Discord account with MMC.\n`)
	if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.VERIFIED)) embed.addField("Unregister", `Usage: \`mmc unregister\`\nUnregisters your Discord account.\n`)
      //.addField("Top voters", `Usage: \`mmc topvotes\`\nShows the top 5 voters aswell as some basic vote stats.\n`)
      //.addField("Voters index", `Usage: \`mmc votes <username | @user>\`\nShows where a player ranks on the vote list.\n`)
      //.addField("Show players", `Usage: \`mmc list\`\nList all the players that are currently online.\n`)
      //.addField("Get basic information about a player", `Usage: \`mmc player <username | @user>\`\nGets the users name and rank on the server.\n`)

	// Send embed
    return channel.send(embed);

}
