export default async function(args, message) {

	const { channel } = message;
	const { players, limit } = await api("list");

	const embed = new MessageEmbed();
	embed.setColor(Color.INFO)
	embed.setTitle(`Players online`)

	const lines = [];
	lines.push(`**${players.length}/${limit}** Online\n`);
	players.map(({ player, server }) => lines.push(`**${player}** - playing ${server}`));
	embed.setDescription(lines.join("\n"));
	return await channel.send(embed);

}
