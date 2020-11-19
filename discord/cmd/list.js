module.exports = async function(args, message) {

	const { channel } = message;
	const { servers, max_players } = await mmcApi("servers");

	const embed = new MessageEmbed();
	embed.setColor(Color.INFO)
	embed.setTitle(`Players online`)

	const online = [];
	Object.keys(servers).map(server => servers[server].players !== false && servers[server].players.map(player => online.push({ player, server })));

	const lines = [];
	lines.push(`**${online.length}/${max_players}** Online\n`);
	online.map(({ player, server }) => lines.push(`**${player}** - playing ${server}`));
	embed.setDescription(lines.join("\n"));
	return await channel.send(embed);

}
