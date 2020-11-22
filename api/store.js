module.exports = async function(req, res) {

	const DISCOUNT = .7
	const today = new Date();

	function isOnSale() {
		if(today > new Date("11/25/2020") && today < new Date("11/30/2020")) return true;
		if(today > new Date("12/20/2020") && today < new Date("01/05/2021")) return true;
		return false;
	}

	// Get params
	const params = { ...req.body, ...req.query };
	let {  } = params;

	// Create array of packages
	const packages = [];

	// Push VIP package to packages
	let features = await fs.readFile(path.join(__dirname, "../docs/packages", "vip.md"), "utf8");
	packages.push({
		name: "VIP",
		display_prefix: "&2[&aVIP&2]&a",
		expires: isOnSale(),
		price: 2.50 * (isOnSale() ? DISCOUNT : 1),
		features,
		newFeatures: features.split("<u>").length,
		imageURL: "https://i.ibb.co/xFsHFwp/0-vip.png"
	})

	// Push Warrior package to packages
	features = await fs.readFile(path.join(__dirname, "../docs/packages", "warrior.md"), "utf8");
	packages.push({
		name: "Warrior",
		display_prefix: "&3[&bWARRIOR&3]&b",
		expires: isOnSale(),
		price: 7.50 * (isOnSale() ? DISCOUNT : 1),
		features,
		newFeatures: features.split("<u>").length,
		imageURL: "https://i.ibb.co/Tq12SBC/1-warrior.png"
	})

	// Push Hero package to packages
	features = await fs.readFile(path.join(__dirname, "../docs/packages", "hero.md"), "utf8")
	packages.push({
		name: "Hero",
		display_prefix: "&5[&dHERO&5]&d",
		expires: isOnSale(),
		price: 15.00 * (isOnSale() ? DISCOUNT : 1),
		features,
		newFeatures: features.split("<u>").length,
		imageURL: "https://i.ibb.co/J5xDNym/2-hero.png"
	})

	// Push Legend package to packages
	features = await fs.readFile(path.join(__dirname, "../docs/packages", "legend.md"), "utf8");
	packages.push({
		name: "Legend",
		display_prefix: "&6[&eLEGEND&6]&e",
		expires: isOnSale(),
		price: 25.00 * (isOnSale() ? DISCOUNT : 1),
		features,
		newFeatures: features.split("<u>").length,
		imageURL: "https://i.ibb.co/4gGMkmG/3-legend.png"
	})

	// Push Titan package to packages
	if(today > new Date("11/25/2020")) {
		features = await fs.readFile(path.join(__dirname, "../docs/packages", "titan.md"), "utf8");
		packages.push({
			name: "Titan",
			display_prefix: "&4[&cTITAN&4]&c",
			expires: isOnSale(),
			price: 40.00 * (isOnSale() ? DISCOUNT : 1),
			features,
			newFeatures: features.split("<u>").length,
			imageURL: "https://i.ibb.co/wW3wVCX/4-titan.png"
		})
	}

	// Respond to request
	res.json({
		success: true,
		packages
	})

}
