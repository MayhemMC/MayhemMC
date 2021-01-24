import { stripFormats } from "minecraft-text";

// Initialize stripe
import Stripe from "stripe";
const stripe = Stripe(config.stripe.secret_key);

export default req => new Promise(async function(resolve) {

	// Get packages
	const { packages, sale } = await api("store");

	// Get player
	let player = (
		(req.query !== undefined && (req.query.player)) ||
		(req.body !== undefined && (req.body.player)));
	player = (await api("player", { query: player })).players[0];

	// Get rank
	let rank = (
		(req.query !== undefined && (req.query.rank)) ||
		(req.body !== undefined && (req.body.rank)))
	rank = packages.filter(({ name }) => name.toLowerCase() === rank.toLowerCase())[0]

	// Get package price
	const amount_off = (player.donator === null ? 0 : packages.filter(({ name }) => name.toLowerCase() === player.donator.package.toLowerCase())[0].price) * 100 * sale;

	const coupon = await stripe.coupons.create({
	  	amount_off,
	  	duration: "once",
		currency: "usd",
		name: `${player.donator.package.toUpperCase()} Discount`
	});

	// Await payment gateway
	const session = await stripe.checkout.sessions.create({
	    payment_method_types: [ "card" ],
	    line_items: [{
	        price_data: {
	          	currency: "usd",
	          	product_data: {
	            	name: `${rank.name.toUpperCase()} Package for ${player.name}`,
	            	images: [ rank.iconURL ],
	          	},
	          	unit_amount: rank.price * 100 * sale,
	        },
	        quantity: 1,
	    }],
	    mode: "payment",
		discounts: amount_off > 0 ? [{
    		coupon: coupon.id
  		}] : [],
	    success_url: `https://mayhemmc.uk.to/store/thankyou`,
	    cancel_url: `https://mayhemmc.uk.to/store`,
	});

	// Resolve API
	resolve({ sessionid: session.id, public_key: config.stripe.public_key });

});
