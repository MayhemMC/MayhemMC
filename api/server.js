module.exports = async function(req, res) {

	// Get servers from bungee config
	const { servers, player_limit } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/config.yml"), "utf8"));
	const { WHITELIST_PLAYERS, PROTOCOL_VERSION, MAINTENANCE_MODE_ENABLED } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));
	const { VERSION, MOTD, COUNT } = PROTOCOL_VERSION;

	// Parse server names and descriptions from the player count
	const names = [];
	const desc = [];
	COUNT.map(line => {
		if(line.includes("&f: &7({Server@")) {
			names.push(line.split("&f: &7({Server@")[0].replace(/\s\s+/g, ""));
			desc.push([]);
		}
		if(line.includes("&f● &")) {
			desc[desc.length - 1] = [ ...desc[desc.length - 1], line.replace(/\s\s+/g, "") ]
		}
	})

	// Add details to servers
	for (let server in servers) {

		const index = Object.keys(servers).indexOf(server);
		const properties = propReader(path.join(MMC_ROOT, server, "server.properties"));
		const versions = await fs.readdir(path.join(MMC_ROOT, server, "cache"));
		const port = parseInt(servers[server].address.split(":")[1]);
		const pid = parseInt((await exec(`sudo netstat -plant | grep :::${port} | awk '{print $NF}'`)).split("/")[0]);
		const stats = await query(port);

		// Formulate server response
		servers[server] = {
			pid,
			port,
			online: stats !== null,
			display_name: names[index],
			description: desc[index].join("\n"),
			max_players: properties.get("max-players"),
			players: stats !== null && stats.players,
			plugins: stats !== null && stats.plugins.split("; "),
			max_memory: ((await fs.readFile(path.join(MMC_ROOT, server, "start.sh"), "utf8")).split("-jar -Xmx")[1].split(" ")[0] + "b").replace(/Gb/gm, " Gb"),
			gamemode: properties.get("gamemode").toUpperCase(),
			difficulty: properties.get("difficulty").toUpperCase(),
			version: versions[versions.length - 1].split("_")[1].split(".jar")[0],
			unique_joins: (await fs.readdir(path.join(MMC_ROOT, server, properties.get("level-name"), "playerdata"))).filter(a => !a.includes(".dat_old")).length,
		}
	}

	const bungeequery = await query(25577).catch(() => ({ map: null, players: [] }))

	// Formulate final response and respond
	res.json({
		success: true,
		maintenance_mode: MAINTENANCE_MODE_ENABLED,
		supported_protocols: VERSION[0].split(/\&[0-9a-f]/gm)[1],
		administrators: WHITELIST_PLAYERS,
		discord_invite: "4FBnfPA",
		max_players: player_limit,
		software: bungeequery.map,
		players: bungeequery.players,
		motd: MOTD[Math.floor(Math.random() * MOTD.length)].replace(/\<\/section\>\;\<section\>/gm, "\n").replace(/<\/?section\>/gm, ""),
		servers
	})

}
