module.exports = async function(args, message) {

	const { channel } = message;
	const { votes } = await mmcApi("votes", { limit: -1 });

	const sum = votes.reduce((total, { votes }) => votes + total, 0);

	const embed = new MessageEmbed();
	embed.setColor(0x1976d4);
	embed.setTitle(`Votes (${dayjs().format("MMMM")})`)

	const lines = [];
	lines.push(`**${votes.length}** players voted a total **${sum}** times this month.\n`);
	votes.slice(0, 5).map(({ last_name, votes }, key) => lines.push(`**${ordinal(key + 1)}** - \`${last_name}\` - **${votes}** votes`))
	embed.setDescription(lines.join("\n"));
	return await channel.send(embed);

}
