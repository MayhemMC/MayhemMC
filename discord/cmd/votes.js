import dayjs from "dayjs";
import ordinal from "ordinal";

export default async function(args, message) {

	const { channel } = message;
	const { votes } = await api("votes", { limit: -1 });

	const sum = votes.reduce((total, { amount }) => amount + total, 0);

	const embed = new MessageEmbed();
	embed.setColor(Color.INFO);
	embed.setTitle(`Votes (${dayjs().format("MMMM")})`)

	const lines = [];
	lines.push(`**${votes.length}** players voted a total **${sum}** times this month.\n`);
	votes.slice(0, 5).map(({ name, amount }, key) => lines.push(`**${ordinal(key + 1)}** - \`${name}\` - **${amount}** votes`))
	embed.setDescription(lines.join("\n"));
	return await channel.send(embed);

}
