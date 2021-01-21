import dayjs from "dayjs";
import ordinal from "ordinal";

export default async function(args, message) {

	const { channel } = message;
	const { votes, numvotes: sum, numvoters } = await api("votes");

	const embed = new MessageEmbed();
	embed.setColor(Color.INFO);
	embed.setTitle(`Votes (${dayjs().format("MMMM")})`)

	const lines = [];
	lines.push(`**${numvoters}** players voted **${sum}** times this month.\n`);
	votes.map(({ name, amount }, key) => lines.push(`**${ordinal(key + 1)}** - \`${name}\` - **${amount}** votes`))
	embed.setDescription(lines.join("\n"));
	return await channel.send(embed);

}
