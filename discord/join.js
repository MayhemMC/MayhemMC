import { promises as fs } from "fs";
import path from "path";

export default async function(member) {

	// Get discord members id
	const { id } = member;

	// See if user is already registered
	const [ rows ] = await mysql.query(`SELECT * FROM discord_players WHERE discordid="${id}"`);

	if(rows.length !== 0) return member.roles.add(Roles.VERIFIED);

	const embed = new MessageEmbed()
	  .setColor(Color.INFO)
	  .setThumbnail("https://cdn.discordapp.com/avatars/709480797781885000/1d29cbebea56bea8d909d770434d0fb6.png?size=128")
	  .setTitle("Welcome to Mayhem MC")
	  .setDescription(await fs.readFile(path.resolve("docs/welcome.md"), "utf8"))
	return member.send(embed);

}
