import path from "path";
import { promises as fs } from "fs";

export default req => new Promise(async function(resolve, reject) {

	// Set sale factor
	const sale = 1;

	// Get packages from perks folder
	let list = await fs.readdir(path.resolve("./docs/packages"));
		list = list.map(item => item.split(".")[0]);

	// Initialize packages variable
	let packages = [];

	// Iterate through list
	for (const rank of list) {
		let [ features, meta ] = (await fs.readFile(path.resolve("./docs/packages", `${rank}.md`), "utf8")).split("```json");
			meta = JSON.parse(meta.replace(/\n|\r/gm, ""));

		// Get prefix from group
		const [ permissions ] = await mysql.query(`SELECT * FROM luckperms_group_permissions WHERE name="${rank}"`);
		const prefix = permissions.filter(({ permission: node }) => node.includes("prefix"))[0].permission.split(".")[2];

		// Add package to list
		packages.push({ name: rank, ...meta, features, prefix })
	}

	// Sort packages by tier
	packages = packages.sort((a, b) => a.tier - b.tier);

	// Respond to request
	resolve({ packages, sale });

});
