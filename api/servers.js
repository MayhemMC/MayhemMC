let cache = undefined;

module.exports = async function(req, res) {

	// Attempt to resolve server from cache
	const cached = cache;
	if(cached !== undefined && cached.expires > Date.now()) {
		const cached_response = { ...cached };
		delete cached_response.expires;
		return res.json({ ...cached_response, cached: true });
	}

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

	// Query bungee server
	const bungeequery = await query(25577).catch(() => ({ map: null, players: [] }))

	// Get all servers
	const serverList = {};
	for(server in servers) serverList[server] = await mmcApi("server", { server });

	// Formulate final response and respond
	const response = {
		success: true,
		maintenance_mode: MAINTENANCE_MODE_ENABLED,
		supported_protocols: VERSION[0].split(/\&[0-9a-f]/gm)[1],
		administrators: WHITELIST_PLAYERS,
		discord_invite: "4FBnfPA",
		max_players: player_limit,
		software: bungeequery.map,
		players: bungeequery.players,
		motd: MOTD[Math.floor(Math.random() * MOTD.length)].replace(/\<\/section\>\;\<section\>/gm, "\n").replace(/<\/?section\>/gm, ""),
		servers: serverList
	};

	// Send response
	res.json({ ...response, cached: false})

	// Cache response for 5 seconds
	response.expires = Date.now() + 5000;
	cache = response;

}
