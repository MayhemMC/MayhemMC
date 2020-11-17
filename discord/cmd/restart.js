module.exports = async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.MOD)) {
	    const embed = new MessageEmbed()
	    embed.setColor(0xc62828)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Get args
	const [ server = null, delay = "15s" ] = args;

	// If not enough args
	if(server === null) {
		const embed = new MessageEmbed()
	    embed.setColor(0xffc107)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc restart <server> (delay = 15s)`")
	    return channel.send(embed);
	}

	// Get servers to restart
	const servers = server.toLowerCase().split(",");

	// For each server of the specified servers
    for (let server of servers) {
        (async function announce(msleft) {
            await mmcExec(server, `title @a times 0 240 0`);
            await mmcExec(server, `title @a subtitle ["",{"text":">>","color":"dark_gray"},{"text":" Restarting in","bold":true,"color":"yellow"},{"text":": ","color":"gray"},{"text":"${prettyms(msleft, { compact: true })}","color":"white"},{"text":" <<","color":"dark_gray"}]`);
            await mmcExec(server, `title @a title {"text":" "}`)
            if (msleft > 1000) setTimeout(() => announce(msleft - 1000), 1000);
	    else await exec(`sudo service mmc@${server} restart`);
        }(ms(delay)));
    }

	const embed = new MessageEmbed()
    embed.setColor(0x19d476)
    embed.setTitle("Restart queued.")
	embed.setDescription(`Servers: \`${servers.join("`, `")}\` will restart in ${delay}!`);
    return channel.send(embed);

}
