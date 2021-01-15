import namemc from "namemc";

export default req => new Promise(async function(resolve, reject) {

	// Get limit
	let limit = parseInt(req.query.limit || req.query.max || 5);
	if(limit === -1) limit = Infinity;

	// If limit is less than 1
	if(limit < 1) return reject("Limit can not be less than 1.");
	if(isNaN(limit)) return reject("Limit must be a number.");

	// Get votes from database
	let [ votes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC${isFinite(limit) ? ` LIMIT ${limit}` : ""}`);
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

				reject(e);

			}
		})
	}));

	votes = votes.filter(element => element.status === "fulfilled").map(element => element.value)

	// Resolve API with result
	resolve({ limit, votes });

});
