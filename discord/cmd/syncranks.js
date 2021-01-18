import namemc from "namemc";

export default async function(args, message) {

	const { channel, member } = message;

	// If user dosnt have permissions
	if(!Object.keys(parseCollection(member.roles.cache)).includes(Roles.OWNER)) {
	    const embed = new MessageEmbed()
	    embed.setColor(Color.ERROR)
	    embed.setTitle("You don't have permission to use this command.")
	    return channel.send(embed);
	}

	// Define role constants
	const role_ids = [ Roles.VIP, Roles.WARRIOR, Roles.HERO, Roles.LEGEND, Roles.TITAN ];
	const role_names = [ "vip", "warrior", "hero", "legend", "titan" ];
	const role_formatted = [ "&2[&aVIP&2]", "&3[&bWARRIOR&3]", "&5[&dHERO&5]", "&6[&eLEGEND&6]", "&4[&cTITAN&4]" ];

	// Get all donators from database
	const [ donators ] = await mysql.query(`SELECT * FROM \`donations\``);

	// Iterate over donators
	await donators.map(async ({ name, package: rank }) => {

		// Get rank
		const role = role_names.indexOf(rank.toLowerCase());

		// Get namemc details
		const [{ currentName, uuid }] = await namemc.lookupName(name);

		// Get discord snowflake from registration
		const [[ registration ]] = await mysql.query(`SELECT * FROM discord_players WHERE uuid="${uuid}"`);
		const discord_id = registration !== undefined ? registration.discordid : null;

		console.log({ currentName, uuid, rank });

		// Send commands
		await inject("lobby", `lp user ${name} parent set ${role_names[role]}`);
		await inject("bungee", `alert &7Thank you &f${name}&7 for supporting the server! You have recieved your ${role_formatted[role]}&7 rank!`);

		if(discord_id !== null) {
			const specimen = await (await client.guilds.fetch("708050277957238784")).members.fetch(discord_id)
		    role_ids.map(role => specimen.roles.remove(role));
			specimen.roles.add(role_ids[role]);
		}

	})

	const embed = new MessageEmbed()
    embed.setColor(Color.SUCCESS)
    embed.setTitle("Ranks synced.")
    return channel.send(embed);

}
