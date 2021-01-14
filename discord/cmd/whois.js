import { MessageEmbed } from "discord.js";
import { stripFormats } from "minecraft-text";
import dayjs from "dayjs";
import ordinal from "ordinal";

export default async function(args, message) {

	// Get stuff from message
	const { channel, mentions, guild } = message;

	// Get args
	const [ user = null ] = args;

	// If not enough args
	if(user === null) {
		const embed = new MessageEmbed();
	    embed.setColor(Color.WARN);
	    embed.setTitle("Incorrect usage.");
		embed.setDescription("`mmc whois <username | @user>`");
	    return await channel.send(embed);
	}

	// Initialize player
	let player = false;

	// Get player from ping or name or uuid
	try {
		const discordid = mentions.users.first().id;
		const [ rows ] = await mysql.query(`SELECT * FROM discord_players WHERE discordid="${discordid}"`);
		if(rows.length > 0) {
			const [{ uuid }] = rows;
			const result = await api("player", { query: uuid });
			if(!result.error) player = result.result[0];
		}
	} catch(e) {
		const result = await api("player", { query: user });
		if(!result.error) player = result.result[0];
	}

	// If player wasn't found
	if(player === false || player === null) {
		const embed = new MessageEmbed();
	    embed.setColor(Color.ERROR);
	    embed.setTitle("Player isn't registered.");
		embed.setDescription("Use the name of the player or make sure you ping a registered player.");
	    return await channel.send(embed);
	}

	// Formulate success embed
	const embed = new MessageEmbed();
	embed.setColor(Color.INFO);
	embed.setTitle(stripFormats(`${player.prefix || ""}${player.name}`, "&"));
	embed.setThumbnail(player.avatar);

	// Add data fields to embed
	embed.addField("UUID", `\`${player.uuid}\``);
	if(player.hasOwnProperty("discord_id") && player.discord_id !== null) embed.addField("Registered as", `<@${player.discord_id}>`, true);

	if(!player.has_joined) return await channel.send(embed);

	embed.addField("Status", player.online ? `🟢 Playing` : `🔴 Offline`, true);
	embed.addField("Votes This Month", !player.hasOwnProperty("votes") || player.votes === null ? "0 Votes" : `${player.votes.amount} Votes • ${ordinal(player.votes.place)} Place`, true)
	embed.addField("First Joined", dayjs(player.first_joined).format("DD/MM/YYYY hh:mm:ss A"), true)
	embed.addField("Last Seen", dayjs(player.last_joined).format("DD/MM/YYYY hh:mm:ss A"), true)
	embed.addField("Group", player.group, true)

	// Initialize and add badges to array
	const badges = [];
	if(player.discord_id !== null) badges.push(guild.emojis.cache.find(emoji => emoji.name === "verified"))
	badges.push(guild.emojis.cache.find(emoji => emoji.name === player.group))
	if(player.migrated === true) badges.push(guild.emojis.cache.find(emoji => emoji.name === "saplayer"))

	// Add badges to embed
	if(badges.length > 0) embed.setDescription(`Badges: ${badges.join(" ")}`);

	// Send to channel
	return await channel.send(embed);

}
