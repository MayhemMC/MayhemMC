module.exports = async function(req, res) {

	// Get params
	const params = { ...req.body, ...req.query };
	let {  } = params;

	// Create array of packages
	const packages = [];

	// Push VIP package to packages
	packages.push({
		name: "VIP",
		display_prefix: "&2[&aVIP&2]&a",
		expires: false,
		price: 2.50,
		features: (await fs.readFile(path.join(__dirname, "../docs/packages", "vip.md"), "utf8")),
		imageURL: "https://dunb17ur4ymx4.cloudfront.net/packages/images/c173ad358fda7d204bac5e61c8f3ad152962284b.png"
	})

	// Push Warrior package to packages
	packages.push({
		name: "Warrior",
		display_prefix: "&3[&bWARRIOR&3]&b",
		expires: false,
		price: 7.50,
		features: (await fs.readFile(path.join(__dirname, "../docs/packages", "warrior.md"), "utf8")),
		imageURL: "https://dunb17ur4ymx4.cloudfront.net/packages/images/5a84497e86d75b2e4ddeefc1f978a710b2d83c17.png"
	})

	// Push Hero package to packages
	packages.push({
		name: "Hero",
		display_prefix: "&5[&dHERO&5]&d",
		expires: false,
		price: 15.00,
		features: (await fs.readFile(path.join(__dirname, "../docs/packages", "hero.md"), "utf8")),
		imageURL: "https://dunb17ur4ymx4.cloudfront.net/packages/images/6c437e11646a9badb4a30a4e86ee4b58e5d0fe42.png"
	})

	// Push Legend package to packages
	packages.push({
		name: "Legend",
		display_prefix: "&6[&eLEGEND&6]&e",
		expires: false,
		price: 25.00,
		features: (await fs.readFile(path.join(__dirname, "../docs/packages", "legend.md"), "utf8")),
		imageURL: "https://dunb17ur4ymx4.cloudfront.net/packages/images/4ad7ba0809ec58cb58620e55b6591aba51b434a6.png"
	})

	// Respond to request
	res.json({
		success: true,
		packages
	})

}
