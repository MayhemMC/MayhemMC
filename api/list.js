import path from "path";
import { promises as fs } from "fs";
import YAML from "yaml";

export default req => new Promise(async function(resolve, reject) {

	// Get timeout
	const timeout = parseInt(req.query.timeout || req.body.timeout || 15);

	// If timeout is less than 1
	if(timeout < 1) return reject("Timeout can not be less than 1.");
	if(isNaN(timeout)) return reject("Timeout must be a number.");

	// Initialize players
	const players = [];

	// Get all active server ports
	const ports = {};
	const { servers } = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "bungee", "config.yml"), "utf8"));
	Object.keys(servers).map(server => ports[server] = parseInt(servers[server].address.split(":")[1]));

	// Initialize partial
	let partial = false;

	// Query bungeecord
	const bx = await mcquery(25577, timeout);

	// Query each server
	for (const server in ports) {
		const port = ports[server];
		const result = await mcquery(port, timeout);
		if(result !== null) {
			result.players.map(player => players.push({ player, server }));
		} else {
			partial = true;
		}
	}

	// If the server query didnt return the player list, fill in from bungee
	bx.players.map(player => {
		if(players.filter(a => a.player === player).length === 0) {
			players.push({ player, server: "?" })
		}
	})

	// Resolve players and their locations
	resolve({ players, limit: parseInt(bx.max_players), online: bx.players.length, partial });

});
