module.exports = async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) {
	    const embed = new MessageEmbed()
	    embed.setColor(0xc62828)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Define role constants
	const role_ids = [ Roles.VIP, Roles.WARRIOR, Roles.HERO, Roles.LEGEND, Roles.TITAN ];
	const role_names = [ "vip", "warrior", "hero", "legend", "titan" ];
	const role_formatted = [ "&2[&aVIP&2]", "&3[&bWARRIOR&3]", "&5[&dHERO&5]", "&6[&eLEGEND&6]", "&4[&cTITAN&4]" ];
	const role_codes = [ "vip", "lite", "mid", "high", "titan" ];

	// Get all donators from database
	const [ donators ] = await mysql.query(`SELECT * FROM \`donations\``);

	const { servers } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/config.yml"), "utf8"));
	donators.map(async ({ name, package: rank }) => {

		const role = role_names.indexOf(rank.toLowerCase());
		const { discord_id } = await mmcApi("player", { name });
		if(discord_id !== false) {
			const specimen = await (await client.guilds.fetch("708050277957238784")).members.fetch(discord_id)
		    role_ids.map(role => specimen.roles.remove(role));
			specimen.roles.add(role_ids[role]);
		}

		for (const server of Object.keys(servers)) {
			await mmcExec(server, `bc Thank you &f${name}&7 for supporting the server! You have recieved your ${role_formatted[role]}&7 rank!`);
			await mmcExec(server, `lp user ${name} parent set ${role_codes[role]}`);
		};
	})

	const embed = new MessageEmbed()
    embed.setColor(Color.SUCCESS)
    embed.setTitle("Ranks synced.")
    return channel.send(embed);

}
