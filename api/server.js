import path from "path";
import { stripFormats } from "minecraft-text";
import { promises as fs } from "fs";
import YAML from "yaml";
import pb from "pretty-bytes";

export default req => new Promise(async function(resolve, reject) {

	// Get timeout
	const timeout = parseInt(
		(req.query !== undefined && (req.query.timeout)) ||
		(req.body !== undefined && (req.body.timeout)) || 15);

	// If timeout is less than 1
	if(timeout < 1) return reject("Timeout can not be less than 1.");
	if(isNaN(timeout)) return reject("Timeout must be a number.");

	// Get specified server
	const server =
		(req.query !== undefined && (req.query.server)) ||
		(req.body !== undefined && (req.body.server)) || null;

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
	const name = server;

	description.shift();
	description.shift();

	// Get about page
	const about = await fs.readFile(path.resolve("./docs/server", `${server}.md`), "utf8").catch(() => null);

	// Get unique joins
	const uniqueJoins = (await fs.readdir(path.join(MMC_ROOT, server, "/plugins/Essentials/userdata"))).length;

	// Get start script
	const start = await fs.readFile(path.join(MMC_ROOT, server, "start.sh"), "utf8");

	// Get memory
	const memory = parseInt(start.split("java -jar -Xmx")[1].split("G")[0]) * Math.pow(10, 9);

	// Get stat on entire server
	const stat = await fs.stat(path.join(MMC_ROOT, server));

	// Get server size
	const size = parseInt((await exec(`du -s ${server}`, { cwd: MMC_ROOT }).catch(() => "0\t")).split("\t")[0]) * 1000;

	// Formulate server response
	const resp = {
		name_formatted, name, icon, description: stripFormats(description.join("\n"), "&"),
		plugins: query.plugins.split(": ")[1].split("; ").reduce((acc, curr) => (acc[curr.split(" ")[0]] = curr.split(" ")[1], acc), {}),
		players: query.players.map(player => ({ player, server: server.toLowerCase() })),
		online: query.players.length,
		limit: parseInt(query.max_players),
		port: ports[server.toLowerCase()],
		version: query.version,
		about,
		uniqueJoins,
		memory,
		memory_formatted: pb(memory),
		available_since: stat.birthtimeMs,
		size,
		size_formatted: pb(size)
	}

	// Respons to request
	resolve({ server: resp });

});
