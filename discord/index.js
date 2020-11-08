global.Discord = require("discord.js");
global.MessageEmbed = Discord.MessageEmbed;
global.client = new Discord.Client();

require("./constants.js");
require("./utils.js");

module.exports = async function() {

	// On client log in
	client.on("ready", async () => {

	  	console.log(chalk.cyan("[DISCORD]"), "Logged into Discord as", chalk.blue(client.user.tag));

		// Show server IP as subtitle
		client.user.setPresence({
		    activity: {
		        name: "mayhemmc.uk.to",
				type: "PLAYING",
		    },
		    status: "online"
		});

	});

	// On command
	client.on("message", message => {
		const [ root, command, ...args ] = message.content.split(" ");
		if(root.toLowerCase() === ".mmc" || root.toLowerCase() === "mmc") {
			try {
				require(`./cmd/${command.toLowerCase()}.js`)(args, message);
			} catch(e) {
				require(`./cmd/help.js`)(args, message);
			}
		}
	});

	// Send welcome message
	client.on("guildMemberAdd", require("./join.js"));

	// Log client in using token
	client.login(config["discord-secret"]);

}
