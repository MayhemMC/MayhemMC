// Initialize stripe
import Stripe from "stripe";
const stripe = Stripe(config.stripe.secret_key);

// API resolver
export default req => new Promise(async function(resolve, reject) {

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

	// Get previous amount paid
	const amount_off = (player.donator === null ? 0 : packages.filter(({ name }) => name.toLowerCase() === player.donator.package.toLowerCase())[0].price) * 100 * sale;

	// Initialize discounts
	const discounts = [];

	// If user paid before take amount off
	if(amount_off > 0) {
		const { id } = await stripe.coupons.create({
		  	amount_off,
		  	duration: "once",
			currency: "usd",
			name: `${player.donator.package[0].toUpperCase()}${player.donator.package.substr(1).toLowerCase()} Discount`
		});
		discounts.push({ coupon: id })
	}

	// Attempt to create a payment gateway
	try {

		// Await payment gateway
		const session = await stripe.checkout.sessions.create({

			// The URL the customer will be directed to if they decide to cancel payment and return to your website.
			cancel_url: `http://${req.hostname}/store`,

			// A unique string to reference the Checkout Session. This can be a customer ID, a cart ID, or similar, and can be used to reconcile the Session with your internal systems.
			client_reference_id: `${player.name};${player.uuid};${rank.name}`,

			// A list of the types of payment methods (e.g., card) this Checkout Session can accept.
		    payment_method_types: [ "card" ],

			// Specify whether Checkout should collect the customer’s billing address.
			billing_address_collection: "required",

			// The mode of the Checkout Session. Required when using prices or setup mode.
		    mode: "payment",

			// The URL to which Stripe should send customers when payment or setup is complete.
		    success_url: `http://${req.hostname}/store/thankyou`,

			// The line items purchased by the customer.
		    line_items: [{
		        price_data: {
		          	product_data: {

						// The name for the item to be displayed on the Checkout page.
						name: `${rank.name[0].toUpperCase()}${rank.name.substr(1).toLowerCase()} package`,

						// The description for the line item, to be displayed on the Checkout page.
						description: `for ${player.name}`,

						// A list of image URLs representing this line item.
						images: [ rank.iconURL ],

		          	},

					// Three-letter ISO currency code, in lowercase. Must be a supported currency.
		          	currency: "usd",

					// A positive integer in cents (or 0 for a free price) representing how much to charge.
		          	unit_amount: rank.price * 100 * sale,

				},

				// A positive integer representing the number of instances of parent that are included in this order item.
				quantity: 1

		    }],

			// The discounts applied to the line item.
			discounts,

		});

		// Resolve API
		resolve({ sessionId: session.id, publicKey: config.stripe.public_key });

	} catch(e) {
		console.error(e)
		reject(e);
	}

});
