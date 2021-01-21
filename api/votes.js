import chalk from "chalk";
import namemc from "namemc";

export default req => new Promise(async function(resolve, reject) {

	// Get limit
	let limit = parseInt(
		(req.query !== undefined && (req.query.limit || req.query.max)) ||
		(req.body !== undefined && (req.body.limit || req.body.max)) || 5);
	if(limit === -1) limit = Infinity;

	console.log({ limit })

	// If limit is less than 1
	if(limit < 1) return reject("Limit can not be less than 1.");
	if(isNaN(limit)) return reject("Limit must be a number.");

	// Get votes from database
	let [ votes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC`);

	// Get number of voters
	const numvoters = votes.length;
	const numvotes = votes.reduce((total, { votes }) => votes + total, 0);

	// Get new names for all players
	votes = (isFinite(limit) ? votes.slice(0, limit) : votes);
	votes = await Promise.allSettled(votes.map((vote, place) => {
		return new Promise(async function(resolve, reject) {
			try {

				// Get other properties
				const { votes, uuid, last_vote } = vote;

				// Get current username from namemc
				const { currentName: name } = await namemc.lookupUUID(uuid);

				// Return with data
				resolve({ name, uuid, amount: votes, place: place + 1, timestamp: new Date(last_vote).getTime() })

			} catch (e) {

				// Reject and log error
				console.error(chalk.red("[ERROR]"), e)
				reject(e);

			}
		})
	}));

	votes = votes.filter(element => element.status === "fulfilled").map(element => element.value)

	// Resolve API with result
	resolve({ limit, votes, numvoters, numvotes });

});
