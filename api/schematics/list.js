import { promises as fs } from "fs";
import path from "path";
import pb from "pretty-bytes";

export default req => new Promise(async function(resolve, reject) {

	// Get player
	let player = (
		(req.query !== undefined && (req.query.player)) ||
		(req.body !== undefined && (req.body.player)))

	// If no query was given
	if(player === undefined) return reject(`No player specified`)

	// Get player object from server
	player = (await api("player", { q: player })).players[0];

	// Get players schematics folder
	const folder = path.join(MMC_ROOT, "creative/plugins/FastAsyncWorldEdit/schematics", `${player.uuid}`);

	// Make sure schematics folder exists
	const exists = await fs.stat(folder).then(() => true).catch(() => false);

	// If dosnt exist
	if(exists === false) return reject(`Empty dir`);

	// Get schematics
	let list = await fs.readdir(folder);
		list = await Promise.allSettled(list.map(item => new Promise(async resolve => {

			// Iterate async over all files
			const schem = path.join(folder, item);

			// Get stat
			const { mtimeMs: created, size } = await fs.stat(schem);

			resolve({
				path: schem,
				name: path.basename(schem),
				created,
				size,
				size_formatted: pb(size)
			})

		})));
		list = list.map(({ value }) => value);

	// Resolve API with result
	resolve({ files: list });

});
