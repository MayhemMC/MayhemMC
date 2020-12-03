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
		require("./bump.js");

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
