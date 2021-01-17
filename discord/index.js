import chalk from "chalk";
import Discord from "discord.js";

global.Discord = Discord;
global.MessageEmbed = Discord.MessageEmbed;
global.client = new Discord.Client();

export default async function() {

	await import("./constants.js");
	await import("./utils.js");

	// On client log in
	client.on("ready", async () => {

		// Log client
	  	console.log(chalk.blue("[INFO]"), chalk.magenta("[DISCORD]"), "Logged into Discord as", chalk.cyan(client.user.tag));

		// Show server IP as subtitle
		client.user.setPresence({
		    activity: {
		        name: "mayhemmc.uk.to",
				type: "PLAYING",
		    },
		    status: "online"
		});

		// Remind people to bump :P
		await import("./bump.js");

	});

	// On command
	client.on("message", async message => {
		const [ root, command, ...args ] = message.content.split(" ");
		if(root.toLowerCase() === ".mmc" || root.toLowerCase() === "mmc") {
			try {
				if(command === "" || command === undefined) throw "Cannot find module";
				(await import(`./cmd/${command.toLowerCase()}.js`)).default(args, message);
			} catch(e) {
				console.error(chalk.red("[ERROR]"), chalk.magenta("[DISCORD]"), e)
				if(e.toString() === "TypeError: Cannot read property 'toLowerCase' of undefined" || e.toString().includes("Cannot find module")) {
					(await import(`./cmd/help.js`)).default(args, message);
				}
			}
		}
	});

	// Send welcome message
	client.on("guildMemberAdd", (await import("./join.js")).default);

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
