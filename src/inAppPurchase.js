import React, { Fragment } from "react";
import { renderToString } from "react-dom/server";
import MCText from "mctext-react";

export default function inAppPurchase({ player, name, price, display_prefix }) {

	function ready(player) {
		Photon.Dialog({
		    title: "Checkout:",
			transition: "grow",
			dismissable: false,
		    content: renderToString(<Fragment>
				You <code>{player}</code> are about to purchase the <code><MCText>{display_prefix.replace(/\&/gm, "§")}</MCText></code> package for <code>{Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(price)}</code>
				<br/>
				<div style={{ margin: "0 24px" }}>
					1. Make sure you're in our <a href="https://discord.gg/4FBnfPA" className="link" target="_blank">Discord Server</a>.
					<br/><br/>
					2. DM me (<code>JoshM#0001</code>) the Transaction ID.
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
		        id: "name",
		        label: "Minecraft username"
		    }],
			actions: [{
				name: "continue",
				async click(dialog) {

					function finalize() {
						dialog.close();
						ready(name);
					}

					const { name } = dialog.fields();
					const { packages } = await app.api("store");
					const playerInfo = await app.api("player", { name });

					if(playerInfo.success === false) return finalize();
					if(playerInfo.donator === false) return finalize();

					packages.map(({ name, price: discount }) => {
						if(name.toUpperCase() === playerInfo.donator.package) {
							price -= discount;
						}
					})

					finalize();
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
