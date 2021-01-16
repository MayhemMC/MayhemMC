import path from "path";
import { promises as fs } from "fs";
import YAML from "yaml";

export default req => new Promise(async function(resolve, reject) {

	// Initialize players
	const players = [];

	// Get all active server ports
	const ports = {};
	const { servers, player_limit: limit } = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "bungee", "config.yml"), "utf8"));
	Object.keys(servers).map(server => ports[server] = parseInt(servers[server].address.split(":")[1]));

	// Query each server
	for (const server in ports) {
		const port = ports[server];
		const result = await mcquery(port);
		if(result !== null) result.players.map(player => players.push({ player, server }));
	}

	// Resolve players and their locations
	resolve({ players, limit, online: players.length });

});
