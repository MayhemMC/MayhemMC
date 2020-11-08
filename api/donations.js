module.exports = async function(req, res) {

	// Get params
	const params = { ...req.body, ...req.query };
	let { limit = 5 } = params;

	// Convert limit to int
	limit = parseInt(limit);
	if(limit === -1) limit = 50000;

	// Get votes from database
	const [ donations ] = await mysql.query(`SELECT * FROM donations ORDER BY timestamp DESC LIMIT ${limit}`)

	// Respond to request
	res.json({
		success: true,
		limit: limit === 50000 ? false : limit,
		donations
	})

}
