import chalk from "chalk";
import namemc from "namemc";

export default req => new Promise(async function(resolve, reject) {

	// Get limit
	let limit = parseInt(req.query.limit || req.query.max || 5);
	if(limit === -1) limit = Infinity;

	// If limit is less than 1
	if(limit < 1) return reject("Limit can not be less than 1.");
	if(isNaN(limit)) return reject("Limit must be a number.");

	// Get donations from database
	let [ donations ] = await mysql.query(`SELECT * FROM donations ORDER BY timestamp DESC${isFinite(limit) ? ` LIMIT ${limit}` : ""}`);
	donations = await Promise.allSettled(donations.map(donation => {
		return new Promise(async function(resolve, reject) {
			try {

				// Get other properties
				const { uuid, timestamp, package: rank } = donation;

				// Get current username from namemc
				const { currentName: name } = await namemc.lookupUUID(uuid);

				// Get prefix from group
				const [ permissions ] = await mysql.query(`SELECT * FROM luckperms_group_permissions WHERE name="${rank.toLowerCase()}"`);
				const prefix = permissions.filter(({ permission: node }) => node.includes("prefix"))[0].permission.split(".")[2];

				// Return with data
				resolve({ name, uuid, package: rank.toLowerCase(), prefix, timestamp: new Date(timestamp).getTime() })

			} catch (e) {

				// Reject and log error
				console.error(chalk.red("[ERROR]"), e)
				reject(e);

			}
		})
	}));

	donations = donations.filter(element => element.status === "fulfilled").map(element => element.value)

	// Resolve API with result
	resolve({ limit, donations });

});
