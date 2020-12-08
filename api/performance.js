const si = require("systeminformation");
const pb = require("pretty-bytes");
const osu = require("node-os-utils");

// Formulate response
let response = { success: false, error: "API warming up, please wait..." }

// Use timer to reduce duration
setInterval(profile, 1000); profile();

// Initialize
si.networkStats()

async function profile() {

	// Get CPU info
	const cpu = await si.cpu();
	cpu.speed = (await si.cpuCurrentspeed()).avg;
	cpu.temp = (await si.cpuTemperature()).main;
	cpu.usage = Math.trunc(await osu.cpu.usage())/100;

	// Get MEM info
	const mem = await si.mem();
	mem.dimm = (await si.memLayout())[0];

	// Get Storage info
	const storage = await si.diskLayout();
	storage.size = await si.fsSize();

	// Get network info
	const network = (await si.networkStats())[0];
	network.ping = await si.inetLatency();

	// Reset response
	response = { success: true };

	// Add cpu data to response
	response.cpu = {};
	response.cpu.model = `${cpu.manufacturer} ${cpu.brand} @ ${cpu.speedmax}GHz`;
	response.cpu.speed = `${cpu.speed}GHz`;
	response.cpu.cores = cpu.cores
	response.cpu.temp = `${cpu.temp} °C`;
	response.cpu.usage = cpu.usage

	// Add mem data to response
	response.mem = {}
	response.mem.total = pb(mem.total + mem.swaptotal);
	response.mem.used = pb(mem.used + mem.swapused);
	response.mem.usage = Math.trunc((mem.used + mem.swapused) / (mem.total + mem.swaptotal)*100)/100;
	response.mem.dimm = `${mem.dimm.type} ${mem.dimm.clockSpeed}MHz`

	// Add storage data to response
	response.storage = {};
	response.storage.total = 0;
	storage.size.map(({ size }) => response.storage.total += size);
	response.storage.used = 0;
	storage.size.map(({ used }) => response.storage.used += used);
	response.storage.usage =  Math.trunc(response.storage.used/response.storage.total*100)/100
	response.storage.total = pb(response.storage.total);
	response.storage.used = pb(response.storage.used);

	// Add network data to response
	response.network = {}
	response.network.send = pb(network.tx_sec * 8, { bits: true }) + "/s"
	response.network.recieve = pb(network.rx_sec * 8, { bits: true }) + "/s"
	response.network.ping = network.ping
	response.network.usage = Math.floor((network.rx_sec * 8 + network.tx_sec * 8)/Math.pow(1024, 3) * 100)/100;

}

module.exports = async function(req, res) {

	// Set a timer to timeout request after 5 seconds
	setTimeout(function() {
		if(res.headersSent) return;
		res.json({ success: false, error: "Request timed out" });
	}, 10000);

	// Respond to request
	res.json(response);

}
