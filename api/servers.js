import path from "path";
import { stripFormats } from "minecraft-text";
import { promises as fs } from "fs";
import YAML from "yaml";

export default req => new Promise(async function(resolve, reject) {

	// Get timeout
	const timeout = parseInt(req.query.timeout || req.body.timeout || 15);

	// If timeout is less than 1
	if(timeout < 1) return reject("Timeout can not be less than 1.");
	if(isNaN(timeout)) return reject("Timeout must be a number.");

	// Initialize servers
	const servers = [];

	// Get all active server ports
	const ports = {};
	const { servers: srvs } = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "bungee", "config.yml"), "utf8"));
	Object.keys(srvs).map(server => ports[server] = parseInt(srvs[server].address.split(":")[1]));

	// Initialize partial
	let partial = false;

	// Get server menu
	const menu = YAML.parse(await fs.readFile(path.resolve(MMC_ROOT, "lobby/plugins/ChestCommands/menu", "servers.yml"), "utf8"));

	// Query each server
	for (const server in ports) {
		const port = ports[server];
		const result = await mcquery(port, timeout);
		if(result === null) {
			partial = true;
		} else {

			// Get server version
			const { version } = result;

			// Get properties from the server menu
			const { NAME: name_formatted, MATERIAL: icon, LORE: description } = menu[server];
			const name = stripFormats(name_formatted, "&");

			description.shift();
			description.shift();

			// Push to response
			servers.push({ server, version, name_formatted, name, icon, description: stripFormats(description.join("\n"), "&") });

		}
	}

	// Respons to request
	resolve({ servers, partial });

});
