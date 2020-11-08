const { lookupName, lookupUUID } = require("namemc");

module.exports = async function(req, res) {

	// Get params
	const params = { ...req.body, ...req.query };
	let { name } = params;

	let player = (await lookupName(name).catch(() => false))
	if(player === false) return res.json({ success: false, error: `Player '${name}' dosn't exist.` });
	if(player === null) return res.json({ success: false, error: "No player specified. Use the 'name' or 'uuid' parameters." });
	player = player.filter(a => a.currentName.toLowerCase() === name.toLowerCase())[0] || player[0];
	if(!await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`)).catch(() => false)) return res.json({ success: false, error: `'${player.currentName}' has never joined Mayhem MC before.` });

	const { WHITELIST_PLAYERS } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));

	const { discordid = false } = (await mysql.query(`SELECT * FROM discord_players WHERE uuid = "${player.uuid}"`))[0][0] || {};
	const [ votes ] = await mysql.query(`SELECT * FROM votes WHERE uuid = "${player.uuid}"`);
	const [ donations ] = await mysql.query(`SELECT * FROM donations WHERE uuid = "${player.uuid}"`);
	const playerfile = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`), "utf8"));

	// Respond to request
	res.json({
		success: true,
		uuid: player.uuid,
		name: player.currentName,
		administrator: WHITELIST_PLAYERS.includes(player.currentName),
		discord_id: discordid,
		donator: donations.length === 0 ? false : {
			package: donations[0].package,
			timestamp: donations[0].timestamp
		},
		votes: votes.length === 0 ? false : {
			amount: votes[0].votes,
			timestamp: votes[0].last_vote
		},
		first_joined: (await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`))).birthtime,
		last_joined: new Date(playerfile.timestamps.login)
	})

}
