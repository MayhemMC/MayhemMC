const { lookupName, lookupUUID } = require("namemc");
const { ungzip } = require("node-gzip");

const usercache = {};

module.exports = async function(req, res) {

	const timeout = setTimeout(function() {
		if(res.headersSent) return;
		res.json({ success: false, error: "Request timed out" });
	}, 2500)

	// Get params
	const params = { ...req.body, ...req.query };
	let { name, uuid } = params;

	if(name === undefined && uuid === undefined) return res.json({ success: false, error: "No player specified. Use the 'name' or 'uuid' parameters to specify a target player." });

	const cached = usercache[name || uuid];
	if(cached !== undefined && cached.expires > Date.now()) {
		const cached_response = { ...cached };
		delete cached_response.expires;
		return res.json({ ...cached_response, cached: true });
	}

	let player;

	if(name !== undefined) player = (await lookupName(name).catch(() => false));
	if(uuid !== undefined) player = (await lookupUUID(uuid).then(a => [a]).catch(() => false));
	if(player === false) return res.json({ success: false, error: `Player '${name}' dosn't exist.` });

	// Get first player
	player = player.filter(a => a.currentName.toLowerCase() === (name || "").toLowerCase() || a.uuid === uuid)[0] || player[0];
	if(!await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`)).catch(() => false)) return res.json({ success: false, error: `'${player.currentName}' has never joined Mayhem MC before.` });

	const { WHITELIST_PLAYERS } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));

	const { discordid = false } = (await mysql.query(`SELECT * FROM discord_players WHERE uuid = "${player.uuid}"`))[0][0] || {};
	const [ allvotes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC`);
	const votes = allvotes.filter(vote => vote.uuid === player.uuid);
	const [ donations ] = await mysql.query(`SELECT * FROM donations WHERE uuid = "${player.uuid}"`);
	const playerfile = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`), "utf8"));

	let prefix = "&7";
	if(donations.length !== 0) prefix = (await mmcApi("store")).packages.filter(p => p.name.toUpperCase() === donations[0].package)[0].display_prefix + " ";
	if(WHITELIST_PLAYERS.includes(player.currentName)) prefix = "&8[&7&lADMIN&8]&f&l "
	if(player.uuid === "1eb084b8-588e-43e6-bdd3-e05e53682987") prefix = "&8[&3&lOWNER&8]&f&l "

	// This finna eat memory but it needa happen to resolve players IP from logs
	const logs = path.join(MMC_ROOT, "bungee/logs");
	const files = await fs.readdir(logs);

	let addresses = {};
	files.map(async file => {

		let content = "";
		if(file.includes(".log.gz")) {
			content = (await ungzip(await fs.readFile(path.join(logs, file)))).toString();
		} else {
			content = await fs.readFile(path.join(logs, file), "utf8");
		}

		clines = content.split("\n");
		clines = clines.filter(line => line.includes("[Votifier NIO worker/INFO] [NuVotifier]: Got a protocol"));
		clines = clines.filter(line => line.includes(`username:${player.currentName}`));
		clines = clines.map(line => line.split(`address:`)[1].split(" ")[0]);
		clines = clines.filter(line => !line.includes(":"));
		clines.map(line => addresses[line] = true);

		if(files.indexOf(file) === files.length - 1) {

			addresses = Object.keys(addresses)

			const response = {
				success: true,
				uuid: player.uuid,
				name: player.currentName,
				administrator: WHITELIST_PLAYERS.includes(player.currentName),
				discord_id: discordid,
				donator: donations.length === 0 ? false : {
					package: donations[0].package,
					timestamp: donations[0].timestamp,
				},
				prefix,
				known_addresses: addresses.length,
				timezone: addresses.length > 0 ? (await fetch(`http://ip-api.com/json/${addresses[addresses.length - 1]}`).then(resp => resp.json())).timezone : null,
				votes: votes.length === 0 ? false : {
					amount: votes[0].votes,
					timestamp: votes[0].last_vote,
					place: allvotes.indexOf(votes[0])
				},
				first_joined: (await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`))).birthtime,
				last_joined: new Date(playerfile.timestamps.login)
			};

			// Respond to request
			res.json({ ...response, cached: false });

			response.expires = Date.now() + 3600000;
			usercache[name || uuid] = response;

			// Cancel timeout
			clearTimeout(timeout);

		}

	})


}
