global.Discord = require("discord.js");
global.MessageEmbed = Discord.MessageEmbed;
global.client = new Discord.Client();

require("./constants.js");
require("./utils.js");

module.exports = async function() {

	// On client log in
	client.on("ready", () => {
	  	console.log(chalk.cyan("[DISCORD]"), "Logged into Discord as", chalk.blue(client.user.tag));
	});

	// On command
	client.on("message", message => {
		const [ root, command, ...args ] = message.content.split(" ");
		if(root === ".mmc" || root === "mmc") {
			try {
				require(`./cmd/${command.toLowerCase()}.js`)(args, message);
			} catch(e) {
				require(`./cmd/help.js`)(args, message);
			}
		}
	});

	// Log client in using token
	client.login(config["discord-secret"]);

}
