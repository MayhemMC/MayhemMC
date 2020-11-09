module.exports = async function(req, res) {

	// Get params
	const params = { ...req.body, ...req.query };
	let { limit = 5 } = params;

	// Convert limit to int
	limit = parseInt(limit);
	if(limit === -1) limit = 50000;

	// Get votes from database
	const [ votes ] = await mysql.query(`SELECT * FROM votes ORDER BY votes DESC LIMIT ${limit}`)

	// Respond to request
	res.json({
		success: true,
		limit: limit === 50000 ? false : limit,
		links: [
			"https://minecraftservers.org/vote/583568",
			"https://minecraft-server-list.com/server/459450/vote/",
			"https://minecraft-mp.com/server/255961/vote/",
			"https://topg.org/Minecraft/in-605738"
		],
		votes
	})

}
