module.exports = async function(args, message) {

	const { channel, member } = message;

	// Formulate embed object
    const embed = new MessageEmbed()
    embed.setColor("#1976d4")
    embed.setTitle("Mayhem MC Commands")
	embed.addField("List", `Usage: \`mmc list\`\nShows all the players that are currently online.\n`)
	if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.MOD)) embed.addField("Restart", `Usage: \`mmc restart <server> (delay = 15s)\`\nQueues a server restart **(Moderator only)**.\n`)
    if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) embed.addField("Redeem", `Usage: \`mmc redeem <token>\`\nRedeem a rank from the web store **(Owner only)**.\n`)
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.VERIFIED)) embed.addField("Register", `Usage: \`mmc register <username>\`\nRegisters your Discord account with MMC.\n`)
	if(Object.keys(parseCollection(member.roles.cache)).includes(Roles.VERIFIED)) embed.addField("Unregister", `Usage: \`mmc unregister\`\nUnregisters your Discord account.\n`)
	embed.addField("Votes", `Usage: \`mmc votes\`\nShows the top 5 voters aswell as some basic vote stats.\n`)
	embed.addField("Whois", `Usage: \`mmc whois <username | @user>\`\nGets the users name, rank and other information from the server.\n`)

	// Send embed
    return channel.send(embed);

}
