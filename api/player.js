const { lookupName, lookupUUID } = require("namemc");

// Create a cache store in memory
const usercache = {};

module.exports = async function(req, res) {

	// Set a timer to timeout request after 5 seconds
	setTimeout(function() {
		if(res.headersSent) return;
		res.json({ success: false, error: "Request timed out" });
	}, 10000)

	// Get params
	const params = { ...req.body, ...req.query };
	let { name = undefined, uuid = undefined } = params;

	// If not enough params were sent
	if(name === undefined && uuid === undefined) return res.json({ success: false, error: "No player specified. Use the 'name' or 'uuid' parameters to specify a target player." });

	// Attempt to resolve player from cache
	const cached = usercache[(name || uuid).toUpperCase()];
	if(cached !== undefined && cached.expires > Date.now()) {
		const cached_response = { ...cached };
		delete cached_response.expires;
		return res.json({ ...cached_response, cached: true });
	}

	// Get player
	let player = null;

	// Get player from username
	if(name !== undefined) player = (await lookupName(name).catch(() => null));

	// Get player from username
	if(uuid !== undefined) player = [(await lookupUUID(uuid).catch(() => null))];

	// If the player dosnt exist
	if(player === null) return res.json({ success: false, error: `Player '${name}' dosn't exist.` });

	// Make sure namemc returned the right player,
	player = player.filter(a => a.currentName.toLowerCase() === (name || "").toLowerCase() || a.uuid === uuid)[0] || player[0];

	// Make sure player has joined the server before
	if(!await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`)).catch(() => false)) return res.json({ success: false, error: `'${player.currentName}' has never joined Mayhem MC before.` });

	// Get administrators from server api
	const { WHITELIST_PLAYERS } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));

	// Get players discord_id
	const { discordid: discord_id = false } = (await mysql.query(`SELECT * FROM discord_players WHERE uuid = "${player.uuid}"`))[0][0] || {};

	// Get players votes
	const [ allvotes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC`);
	const votes = allvotes.filter(vote => vote.uuid === player.uuid);

	// Get if player is a donator
	const [ donations ] = await mysql.query(`SELECT * FROM donations WHERE uuid = "${player.uuid}"`);

	// Get players prefix
	let prefix = "&7";
	if(donations.length !== 0) prefix = (await mmcApi("store")).packages.filter(p => p.name.toUpperCase() === donations[0].package)[0].display_prefix + " ";
	if(WHITELIST_PLAYERS.includes(player.currentName)) prefix = "&8[&7&lADMIN&8]&f&l "
	if(player.uuid === "1eb084b8-588e-43e6-bdd3-e05e53682987") prefix = "&8[&3&lOWNER&8]&f&l "

	// Get players playerfile
	const playerfile = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`), "utf8"));

	// Get player geolocation
	//#! const { geolocation = { }} = await mmcApi("ip", { uuid: player.uuid, authorization: config["internal-api-key"] })

	// Start formulating response
	const response = {
		success: true,
		uuid: player.uuid,
		name: player.currentName,
		administrator: WHITELIST_PLAYERS.includes(player.currentName),
		discord_id,
		donator: donations.length === 0 ? false : {
			package: donations[0].package,
			timestamp: donations[0].timestamp,
		},
		prefix,
		votes: votes.length === 0 ? false : {
			amount: votes[0].votes,
			timestamp: votes[0].last_vote,
			place: allvotes.indexOf(votes[0])
		},
		first_joined: (await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`))).birthtime,
		last_joined: new Date(playerfile.timestamps.login),
		//#! timezone: geolocation.hasOwnProperty("timezone") && geolocation.timezone
	}

	// Respond to request
	res.json({ ...response, cached: false });

	// Cache response for 1 hour
	response.expires = Date.now() + 3600000;
	usercache[(name || uuid).toUpperCase()] = response;

}
