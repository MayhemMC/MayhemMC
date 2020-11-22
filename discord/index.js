global.Discord = require("discord.js");
global.MessageEmbed = Discord.MessageEmbed;
global.client = new Discord.Client();

require("./constants.js");
require("./utils.js");

module.exports = async function() {

	// On client log in
	client.on("ready", async () => {

		// Log client
	  	console.log(chalk.cyan("[DISCORD]"), "Logged into Discord as", chalk.blue(client.user.tag));

		// Show server IP as subtitle
		client.user.setPresence({
		    activity: {
		        name: "mayhemmc.uk.to",
				type: "PLAYING",
		    },
		    status: "online"
		});

		// Remind people to bump :P
		client.setInterval(async function() {

			// Get bumps channel
			const guild = await client.guilds.fetch("708050277957238784")
			const bumps = await guild.channels.resolve(Channels.BUMP)
			let messages = Object.values(parseCollection(await bumps.messages.fetch({ limit: 10 })));
			messages = messages.filter(message => message.author.id === "302050872383242240");
			messages = messages.filter(message => message.embeds[0].color === 2406327);
			messages = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0];

			if(Date.now() > messages.createdTimestamp + 2*60*60*1000) await bumps.send(`A bump is now available for this server. Do \`!d bump\``);

		}, 300000);

	});

	// On command
	client.on("message", message => {
		const [ root, command, ...args ] = message.content.split(" ");
		if(root.toLowerCase() === ".mmc" || root.toLowerCase() === "mmc") {
			try {
				require(`./cmd/${command.toLowerCase()}.js`)(args, message);
			} catch(e) {
				if(e.toString() === "TypeError: Cannot read property 'toLowerCase' of undefined" || e.toString().includes("Cannot find module")) {
					require(`./cmd/help.js`)(args, message);
				} else {
					console.log(chalk.cyan("[DISCORD]") + chalk.red(" [ERROR]"), e)
				}
			}
		}
	});

	// Send welcome message
	client.on("guildMemberAdd", require("./join.js"));

	// Keep online
	client.on("error", relog);
	client.on("shardError", relog);

	async function relog() {
		await client.destroy();
		global.client = new Discord.Client();
		client.login(config["discord-secret"]);
	}

	// Log client in using token
	client.login(config["discord-secret"]);

}
