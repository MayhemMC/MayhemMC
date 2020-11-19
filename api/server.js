const servercache = {};

module.exports = async function(req, res) {

	// Get params
	const params = { ...req.body, ...req.query };
	let { server = undefined } = params;

	// If no server
	if(server === undefined) return res.json({ success: false, error: "No server specified. Use the 'server' parameter to specify a target server." });

	// Get servers
	const { servers } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/config.yml"), "utf8"));

	// If server not found
	if(!servers.hasOwnProperty(server)) return res.json({ success: false, error: `Target server '${server}' does not exist.` });

	// Attempt to resolve server from cache
	const cached = servercache[server.toUpperCase()];
	if(cached !== undefined && cached.expires > Date.now()) {
		const cached_response = { ...cached };
		delete cached_response.expires;
		return res.json({ ...cached_response, cached: true });
	}

	// Get server config
	const { PROTOCOL_VERSION } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));
	const { COUNT } = PROTOCOL_VERSION;

	// Get stuff from bungee config
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

	// Get properties
	const index = Object.keys(servers).indexOf(server);
	const properties = propReader(path.join(MMC_ROOT, server, "server.properties"));
	const versions = await fs.readdir(path.join(MMC_ROOT, server, "cache"));
	const port = parseInt(servers[server].address.split(":")[1]);
	const pid = parseInt((await exec(`sudo netstat -plant | grep :::${port} | awk '{print $NF}'`)).split("/")[0]);
	const stats = await query(port);

	// Formulate server response
	const response = {
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
	};

	// Send response
	res.json({ ...response, cached: false})

	// Cache response for 5 seconds
	response.expires = Date.now() + 5000;
	servercache[server.toUpperCase()] = response;

}
