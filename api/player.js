const { lookupName, lookupUUID } = require("namemc");

module.exports = async function(req, res) {

	let nores = true;
	setTimeout(function() {
		nores && res.json({ success: false, error: `Player '${name}' dosn't exist.` })
	}, 2000)

	// Get params
	const params = { ...req.body, ...req.query };
	let { name, uuid } = params;

	if(name === undefined && uuid === undefined) return res.json({ success: false, error: "No player specified. Use the 'name' or 'uuid' parameters." });

	let player;

	if(name) player = (await lookupName(name).catch(() => false))
	if(uuid) player = (await lookupUUID(uuid).then(a => [a]).catch(() => false))
	if(player === false) return res.json({ success: false, error: `Player '${name}' dosn't exist.` });
	player = player.filter(a => a.currentName.toLowerCase() === (name || "").toLowerCase() || a.uuid === uuid)[0] || player[0];

	if(!await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`)).catch(() => false)) return res.json({ success: false, error: `'${player.currentName}' has never joined Mayhem MC before.` });

	const { WHITELIST_PLAYERS } = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "bungee/plugins/BungeeAdvancedProxy/config.yml"), "utf8"));

	const { discordid = false } = (await mysql.query(`SELECT * FROM discord_players WHERE uuid = "${player.uuid}"`))[0][0] || {};
	const [ allvotes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC`);
	const votes = allvotes.filter(vote => vote.uuid === player.uuid);
	const [ donations ] = await mysql.query(`SELECT * FROM donations WHERE uuid = "${player.uuid}"`);
	const playerfile = YAML.parse(await fs.readFile(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`), "utf8"));

	nores = false;
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
			timestamp: votes[0].last_vote,
			place: allvotes.indexOf(votes[0])
		},
		first_joined: (await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata", `${player.uuid}.yml`))).birthtime,
		last_joined: new Date(playerfile.timestamps.login)
	});

}
