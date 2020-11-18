const { lookupName, lookupUUID } = require("namemc");
const { ungzip } = require("node-gzip");

// Helper function to get unique values from array
Array.prototype.unique = function() {
 	var o = {}, a = [], i, e;
 	for (i = 0; e = this[i]; i++) o[e] = 1;
 	for (e in o) a.push (e);
 	return a;
}

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
	let { name = undefined, uuid = undefined, authorization = undefined } = params;

	// Validate API key
	if(authorization === undefined || !config["api-keys"].includes(authorization)) return res.json({ success: false, error: "Invalid authorization key." })

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

	// Get past player names
	const names = player.pastNames.map(({ name }) => name.toLowerCase());

	// Attempt to resolve IP address from logs
	let ip = false;

	// Scrape logs
	const logs = path.join(MMC_ROOT, "bungee/logs");
	const files = await fs.readdir(logs);

	// Get all votes from logs
	let votes = [];

	// Iterate through each log
	for (const file of files) {

		let content = "";
		if(file.includes(".log.gz")) {
			content = (await ungzip(await fs.readFile(path.join(logs, file)))).toString();
		} else {
			content = await fs.readFile(path.join(logs, file), "utf8");
		}

		clines = content.split("\n");
		clines = clines.filter(line => line.includes("[Votifier NIO worker/INFO] [NuVotifier]: Got a protocol"));
		clines = clines.map(line => line.toLowerCase());
		clines = clines.map(line => line.split(` -> vote (`)[1].split(`)`)[0]);
		clines = clines.filter(line => names.some(prohb => line.includes(prohb)));
		clines = clines.map(line => line.split(`address:`)[1].split(" ")[0]);
		clines.map(line => line && votes.push(line));

	}

	votes = votes.unique();
	ip = votes.pop();

	// Formulate response
	const response = { ip, previous_ips: votes, geolocation: ip !== false && (await fetch(`http://ip-api.com/json/${ip}`).then(resp => resp.json())) };

	// Respond to request
	res.json({ ...response, cached: false });

	// Cache response for 1 hour
	response.expires = Date.now() + 3600000*24*7;
	usercache[(name || uuid).toUpperCase()] = response;

}
