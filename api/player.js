import path from "path";
import namemc from "namemc";
import { promises as fs } from "fs";

export default req => new Promise(async function(resolve, reject) {


	// Get timeout
	const timeout = parseInt(
		(req.query !== undefined && (req.query.timeout)) ||
		(req.body !== undefined && (req.body.timeout)) || 500);

	// Get query
	let query = (
		(req.query !== undefined && (req.query.q || req.query.query || req.query.search)) ||
		(req.body !== undefined && (req.body.q || req.body.query || req.body.search)))

	// If no query was given
	if(query === undefined) return reject(`No query specified.`)

	query = query.split(",");

	// Get online players
	const online_players = (await mcquery(25577)).players;

	// Iterate through queried players
	let result = await Promise.allSettled(query.map(search => {
		return new Promise(async function(resolve, reject) {

			// Set timeout to autoreject
			setTimeout(reject, timeout);

			// Get appropriate lookup method by search
			const lookup = search.match(/^[0-9a-f]{8}(-)?[0-9a-f]{4}(-)?[0-9a-f]{4}(-)?[0-9a-f]{4}(-)?[0-9a-f]{12}/g) ? namemc.lookupUUID : namemc.lookupName;

			// Lookup user
			let user = await lookup(search);
				user = Array.isArray(user) ? (user.filter(u => u.currentName.toLowerCase() === search.toLowerCase())[0] || user[0]) : user;

			// Initialize response object
			const resp = {};

			// Add static props to response
			resp.name = user.currentName;
			resp.uuid = user.uuid;
			resp.avatar = user.imageUrls.face

			// Check to see if player ever joined the server
			const stat = await fs.stat(path.join(MMC_ROOT, "lobby/plugins/Essentials/userdata/", `${user.uuid}.yml`)).catch(() => false);
			resp.has_joined = stat !== false;

			// If the player has never joined
			if(!resp.has_joined) return resolve(resp);

			// Get player timestamps
			resp.first_joined = Math.floor(stat.birthtimeMs);
			resp.last_joined = Math.floor(stat.mtimeMs);

			// Get discord snowflake from registration
			const [[ registration ]] = await mysql.query(`SELECT * FROM discord_players WHERE uuid="${user.uuid}"`);
			resp.discord_id = registration !== undefined ? registration.discordid : null;

			// Get if player is a legacy account
			resp.migrated = Math.abs(stat.birthtimeMs - 1591471029345) < 20000;

			// Get group from permissions database
			const [[{ primary_group: group } = { primary_group: null }]] = await mysql.query(`SELECT * FROM luckperms_players WHERE uuid="${user.uuid}"`);
			resp.group = group;

			// If account needs data upgrade
			resp.updated = group !== null;
			if(group === null) return resolve(resp);

			// Get prefix from group
			const [ permissions ] = await mysql.query(`SELECT * FROM luckperms_group_permissions WHERE name="${group}"`);
			const prefix = permissions.filter(({ permission: node }) => node.includes("prefix"))[0].permission.split(".")[2];
			resp.prefix = prefix;

			// Get if player is online
			resp.online = false;
			if(resp.updated) resp.online = online_players.includes(resp.name);

			// Get players votes
			const [ allvotes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC`);
			const votes = allvotes.filter(vote => vote.uuid === user.uuid);
			resp.votes = votes.length === 0 ? null : {
				amount: votes[0].votes,
				timestamp: new Date(votes[0].last_vote).getTime(),
				place: allvotes.indexOf(votes[0]) + 1
			}

			// Get if player is a donator
			const [ donations ] = await mysql.query(`SELECT * FROM donations WHERE uuid = "${user.uuid}"`);
			resp.donator = donations.length === 0 ? null : {
				package: donations[0].package,
				timestamp: new Date(donations[0].timestamp).getTime(),
			}

			// Resolve user
			resolve(resp);

		});
	}));

	// Filter output
	result = result.filter(element => element.status === "fulfilled").map(element => element.value)

	// Resolve API with result
	resolve({ players: result });

});
