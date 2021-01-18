import { promises as fs } from "fs";
import namemc from "namemc";

export default async function(args, message) {

	const { channel, member, guild } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Get args
	const [ token = null ] = args;

	// If not enough args
	if(token === null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc redeem <token>`")
	    return channel.send(embed);
	}

	// Decode token
	const decoded = Buffer.from(token, "base64").toString();
	const [ name, rank ] = decoded.split(";");

	// Get player
	let player = await namemc.lookupName(name);
	player = player.filter(a => a.currentName.toLowerCase() === name.toLowerCase())[0] || player[0];
	const { currentName, uuid } = player;

	// Get users from database
	const [ rows ] = await mysql.query(`SELECT * FROM \`discord_players\` WHERE uuid="${uuid}"`);

	// If user isnt registered
	if(rows.length === 0) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("Can't redeem token.")
		embed.setDescription(`\`${currentName}\` is not registered.`)
	    return channel.send(embed);
	}

	// Define role constants
	const role_ids = [ Roles.VIP, Roles.WARRIOR, Roles.HERO, Roles.LEGEND, Roles.TITAN ];
	const role_names = [ "vip", "warrior", "hero", "legend", "titan" ];
	const role_formatted = [ "&2[&aVIP&2]", "&3[&bWARRIOR&3]", "&5[&dHERO&5]", "&6[&eLEGEND&6]", "&4[&cTITAN&4]" ];
	const role = role_names.indexOf(rank.toLowerCase());

	// Get discord id
	const { discordid } = rows[0];

	// Remove all donator roles from member and add specified one
	const specimen = await (await client.guilds.fetch("708050277957238784")).members.fetch(discordid)
    role_ids.map(role => specimen.roles.remove(role));
	specimen.roles.add(role_ids[role]);

	// Insert donation into donators database
	const [ donators ] = await mysql.query(`SELECT * FROM \`donations\` WHERE uuid="${uuid}"`);
	if(donators.length === 0) {
		await mysql.query(`INSERT INTO \`donations\` (uuid, package, name) VALUES ("${uuid}", "${role_names[role].toUpperCase()}", "${currentName}")`);
	} else {
		await mysql.query(`UPDATE \`donations\` SET package="${role_names[role].toUpperCase()}", timestamp=NOW() WHERE uuid="${uuid}"`);
	}

	// Send commands
	await inject("lobby", `lp user ${name} parent set ${role_names[role]}`);
	await inject("bungee", `alert &7Thank you &f${name}&7 for supporting the server! You have recieved your ${role_formatted[role]}&7 rank!`);

	// Send message to joins
	client.channels.cache.get(Channels.JOINS).send(`Thank you ${rows.length !== 0 ? `<@${discordid}>`:`\`${name}\``} for supporting the server! You have recieved your ${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === role_names[role].toUpperCase())} __**\`${role_names[role].toUpperCase()}\`**__ rank!`)

	const embed = new MessageEmbed()
    embed.setColor(Color.SUCCESS)
    embed.setTitle("Package redeemed.")
	embed.addField("Player", currentName, true);
	embed.addField("User", `<@${discordid}>`, true);
	embed.addField("Package", `__**\`${role_names[role].toUpperCase()}\`**__`, true);
    return channel.send(embed);

}
