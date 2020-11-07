// Import React
import React, { Fragment } from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";

// Import app stylesheet
import "./index.less";

// Import jQuery
import "script-loader!jquery";

// Import PhotonCSS
import "photoncss";

// Initialize tracking
import ReactGA from "react-ga";
ReactGA.initialize("UA-115457382-6");

// Register a static asset caching service-worker
location.protocol === "https:" && "serviceWorker" in navigator && navigator.serviceWorker.register("/service-worker.js")

// Import root component
import Root from "components/Root";

// Wait for the DOM to load before rendering
document.addEventListener("DOMContentLoaded", function() {

	// Append a container to the DOM to render content into
	const root = document.createElement("DIV");
	root.id = "root";
	document.body.append(root);

	// Render root component into react-root container
	render(<Root/>, document.getElementById("root"));

});

// Create global `app` definition
global.app = {};

// Resolve assets from the static folder
app.static = asset => require(`./static/${asset}`).default;

// Get current route
app.getRoute = () => location.protocol === "file:" ? (location.href.split("#")[1] || "/") : location.pathname;

// Cache server query
const MAX_CACHE_AGE = 5000;
let QUERY_CACHE_AGE = performance.now();
app.QUERY_CACHE = false;
app.query = () => new Promise(resolve => {
	if((app.QUERY_CACHE === false || performance.now() - QUERY_CACHE_AGE > MAX_CACHE_AGE) && app.QUERY_CACHE !== null) {
		app.QUERY_CACHE = null;
		fetch("https://mayhemmc.uk.to/api").then(response => response.json().then(json => {
			app.QUERY_CACHE = json;
			QUERY_CACHE_AGE = performance.now();
			resolve(app.QUERY_CACHE);
		}));
	} else if (app.QUERY_CACHE === null) {
		(function loop() {
			if(app.QUERY_CACHE === null || app.QUERY_CACHE === false) requestAnimationFrame(loop);
			else resolve(app.QUERY_CACHE);
		}())
	} else {
		resolve(app.QUERY_CACHE);
	}
});



app.inAppPurchase = function({ player, name, price, BTC }) {

	function ready(player) {
		Photon.Dialog({
		    title: "Checkout: " + name,
			transition: "grow",
			dismissable: false,
		    content: renderToString(<Fragment>
				You ({player}) are about to purchase the {name} rank!
				<br/>
				<code>{Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(price)}</code> / <code>{BTC} BTC</code>
				<br/>
				<div style={{ margin: "0 24px" }}>
					<div style={{ fontSize: 20, fontWeigvht: 500 }}>Complete Purchase</div>
					1. Make sure you're in our Discord server. <a href="https://discord.gg/4FBnfPA" className="link" target="_blank">https://discord.gg/4FBnfPA</a>.
					<br/><br/>
					2. DM or ping me (<code>JoshM#0001</code>) and tell me you just made a purchase. Copy and paste the Transition ID below and send that aswell as proof of your purchase.
					<br/><br/>
					Transaction ID: <code>{btoa(`${player};${name.toUpperCase()}`)}</code>
				</div>
			</Fragment>),
			actions: [{
				name: "next",
				click() {
					window.open("//paypal.me/jmer05")
				}
			}, {
				name: "cancel",
				click(dialog) {
					dialog.close();
				}
			}]
		}).open();
	}

	if(player === null || player === "") {
		Photon.Dialog({
		    title: "Minecraft username required",
			transition: "grow",
			type: "form",
			dismissable: false,
		    content: "Please enter your Minecraft username below:",
		    fields: [{
		        id: "username",
		        label: "Minecraft username"
		    }],
			actions: [{
				name: "continue",
				click(dialog) {
					const { username } = dialog.fields();
					dialog.close();
					ready(username);
				}
			}, {
				name: "cancel",
				click(dialog) {
					dialog.close();
				}
			}]
		}).open();
	} else {
		ready(player);
	}

}
