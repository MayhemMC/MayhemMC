module.exports = async function(args, message) {

	const { channel, mentions, guild } = message;

	// Get args
	const [ user = null ] = args;

	// If not enough args
	if(user === null) {
		const embed = new MessageEmbed()
	    embed.setColor(Color.WARN)
	    embed.setTitle("Incorrect usage.")
		embed.setDescription("`mmc whois <username | @user>`")
	    return channel.send(embed);
	}

	let player = false;

	try {
		discordid = mentions.users.first().id;
		const [ rows ] = await mysql.query(`SELECT * FROM discord_players WHERE discordid="${discordid}"`);
		if(rows.length > 0) {
			const [{ uuid }] = rows;
			const result = await mmcApi("player", { uuid });
			if(result.success) player = result;
		}
	} catch(e) {
		const result = await mmcApi("player", { name: user });
		if(result.success) player = result;
	}

	if(player === false) {
		if(Object.keys(parseCollection(mentions.users)).length === 0) {
			const embed = new MessageEmbed()
		    embed.setColor(Color.ERROR)
		    embed.setTitle("Player not found.")
			embed.setDescription(`\`${user}\` has never joined the server before.`)
		    return channel.send(embed);
		}
		const embed = new MessageEmbed()
		embed.setColor(Color.ERROR)
		embed.setTitle("Player not found.")
		embed.setDescription(`${mentions.users.first().toString()} is not registered.`)
		return channel.send(embed);
	}

	player.discord = await (await client.guilds.fetch("708050277957238784")).members.fetch(player.discord_id)

	const rank = player.donator ? [
		`${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === "VIP")} __**\`VIP\`**__`,
		`${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === "WARRIOR")} __**\`WARRIOR\`**__`,
		`${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === "HERO")} __**\`HERO\`**__`,
		`${guild.emojis.cache.find(emoji => emoji.name.toUpperCase() === "LEGEND")} __**\`LEGEND\`**__`
	]["VIP;WARRIOR;HERO;LEGEND".split(";").indexOf(player.donator.package)]: false;

	const embed = new MessageEmbed();
	embed.setColor(Color.INFO);
	embed.setTitle(`Who is '${player.name}'`);
	embed.setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`);

	embed.setDescription(player.discord.toString());

	rank && embed.addField("Donator Rank", rank);
	player.votes && embed.addField("Votes", `**${ordinal(player.votes.place + 1)}** place • **${player.votes.amount}** votes • **${dayjs(player.votes.timestamp).fromNow(true)}** ago`)

	embed.addField("First joined", dayjs(player.first_joined).format("`hh:mmA` • `MM/DD/YYYY`"))
	embed.addField("Last seen", `**${dayjs(player.last_joined).fromNow(true)}** ago`)

	if(player.hasOwnProperty("timezone") && player.timezone !== null && player.timezone !== false) embed.addField("Timezone", `**${player.timezone}**`)

	return await channel.send(embed);

}
