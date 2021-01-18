import path from "path";
import { stripFormats } from "minecraft-text";
import { promises as fs } from "fs";
import YAML from "yaml";

export default req => new Promise(async function(resolve, reject) {

	// Get timeout
	const timeout = parseInt(req.query.timeout || 15);

	// If timeout is less than 1
	if(timeout < 1) return reject("Timeout can not be less than 1.");
	if(isNaN(timeout)) return reject("Timeout must be a number.");

	// Get specified server
	const { server = null } = req.query;

	// If no server
	if(server === null) return reject("No server specified.");

	// Get all active server ports
	const ports = {};
	const { servers: srvs } = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "bungee", "config.yml"), "utf8"));
	Object.keys(srvs).map(server => ports[server] = parseInt(srvs[server].address.split(":")[1]));

	// If server does not exist
	if(!ports.hasOwnProperty(server.toLowerCase())) return reject(`Server '${server}' does not exist.`);

	// Query server
	const query = await mcquery(ports[server.toLowerCase()], timeout);

	// If query failed
	if(query === null) return reject("Server query failed.");

	// Get server menu
	const menu = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "lobby/plugins/ChestCommands/menu", "servers.yml"), "utf8"));

	// Get properties from the server menu
	const { NAME: name_formatted, MATERIAL: icon, LORE: description } = menu[server];
	const name = stripFormats(name_formatted, "&");

	description.shift();
	description.shift();

	// Formulate server response
	const resp = {
		name_formatted, name, icon, description: stripFormats(description.join("\n"), "&"),
		plugins: query.plugins.split(": ")[1].split("; ").reduce((acc, curr) => (acc[curr.split(" ")[0]] = curr.split(" ")[1], acc), {}),
		players: query.players.map(player => ({ player, server: server.toLowerCase() })),
		online: query.players.length,
		limit: parseInt(query.max_players),
		port: ports[server.toLowerCase()],
		version: query.version
	}

	// Respons to request
	resolve({ server: resp });

});
