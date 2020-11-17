module.exports = async function(member) {

	// Get discord members id
	const { id } = member;

	// See if user is already registered
	const [ rows ] = await mysql.query(`SELECT * FROM discord_players WHERE discordid="${id}"`);

	if(rows.length !== 0) return member.roles.add(Roles.VERIFIED);

	const embed = new MessageEmbed()
	  .setColor("#1976d4")
	  .setThumbnail("https://cdn.discordapp.com/avatars/709480797781885000/62633d48422e87edfd80df254d12f8c3.webp?size=128")
	  .setTitle("Welcome to Mayhem MC")
	  .setDescription(await fs.readFile(path.resolve("docs/welcome.md"), "utf8"))
	return member.send(embed);

}
