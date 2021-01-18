export default async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.MOD)) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Get args
	const [ server = null ] = args;

	// If not enough args
	if(server === null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc restart <server>`")
	    return channel.send(embed);
	}

	// Get servers to restart
	const servers = server.toLowerCase().split(",");

	// For each server of the specified servers
    for (let server of servers) await exec(`sudo service mmc@${server} restart`);

	const embed = new MessageEmbed()
    embed.setColor(Color.SUCCESS)
    embed.setTitle("Servers Restarting.")
	embed.setDescription(`Servers: \`${servers.join("`, `")}\` are shutting down!`);
    return channel.send(embed);

}
