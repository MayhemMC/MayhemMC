export default async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Get cmd to execute
	const cmd = args.join(" ").replace(/\`/gm, "");

	if(cmd === undefined || cmd === "") {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Invalid usage.")
		embed.setDescription(`Usage: \`mmc adminexec 'command to run'\` Runs a command on all servers **(Owner only)**.`)
	    return channel.send(embed);
	}

	const { servers } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/config.yml"), "utf8"));
	for (const server of Object.keys(servers)) await mmcExec(server, cmd);

    const embed = new MessageEmbed()
    embed.setColor(Color.SUCCESS)
    embed.setTitle("Command executed.")
	embed.setDescription(`Command \`/${cmd}\` ran successfully on all servers.`)
    return channel.send(embed);

}
