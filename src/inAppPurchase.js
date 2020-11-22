import React, { Fragment } from "react";
import { renderToString } from "react-dom/server";
import MCText from "components/MCText";

export default function inAppPurchase({ player, name, price, display_prefix }) {

	function ready(player, prefix = "&7") {

		if(price < 0) {
			return Photon.Dialog({
			    title: "Error",
				transition: "grow",
				dismissable: false,
			    content: renderToString(<Fragment>
					<div style={{ margin: "0 24px", marginTop: -24 }}>
						You <code><MCText style={{ display: "inline" }}>{(prefix + player).replace(/\&/gm, "§").trim()}</MCText></code> have already purchased the <code><MCText style={{ display: "inline" }}>{display_prefix.replace(/\&/gm, "§").trim()}</MCText></code> package.
						<br/>
						If you're buying this package as a gift for someone else, use that players name instead.
					</div>
				</Fragment>),
				actions: [{
					name: "okay",
					click(dialog) {
						dialog.close();
					}
				}]
			}).open();
		}

		Photon.Dialog({
		    title: "Checkout:",
			transition: "grow",
			dismissable: false,
		    content: renderToString(<Fragment>
				<div style={{ margin: "0 24px", marginTop: -24 }}>
					You <code><MCText style={{ display: "inline" }}>{(prefix + player).replace(/\&/gm, "§").trim()}</MCText></code> are about to purchase the <code><MCText style={{ display: "inline" }}>{display_prefix.replace(/\&/gm, "§").trim()}</MCText></code> package.
				</div>
				<br/>
				<div style={{ margin: "0 24px" }}>
					1. Make sure you're in our <a href="https://discord.gg/4FBnfPA" className="link" target="_blank">Discord Server</a> and registered.
					<br/><br/>
					2. Copy and paste the Transaction ID and DM it to me(<code>JoshM#0001</code>).
					<br/>
					Transaction ID: <code>{btoa(`${player};${name.toUpperCase()}`)}</code>
					<br/><br/>
					3. Click "checkout" and enter in <code>{Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(price)}</code>. If you are eligable for a discount due to purchasing a package in the past and pay the full price, it will be treated as a donation.
				</div>
			</Fragment>),
			actions: [{
				name: "checkout",
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

					async function finalize(a = true) {
						dialog.close();
						const playerInfo = await app.api("player", { name });
						a && ready(playerInfo.name, playerInfo.prefix);
					}

					let { name } = dialog.fields();
					const { packages } = await app.api("store");
					const playerInfo = await app.api("player", { name });

					if(playerInfo.success === false) {
						finalize(false);
						return Photon.Dialog({
						    title: "Error",
							transition: "grow",
							dismissable: false,
						    content: renderToString(<Fragment>
								<div style={{ margin: "0 24px", marginTop: -24 }}>
									You must join our server <code>mayhemmc.uk.to</code> before purchasing a rank.
								</div>
							</Fragment>),
							actions: [{
								name: "okay",
								click(dialog) {
									dialog.close();
								}
							}]
						}).open();
					}
					if(playerInfo.donator === false) return finalize();

					packages.map(({ name: rank, price: discount }) => {
						if(rank.toUpperCase() === playerInfo.donator.package) {
							price -= discount;
							name = playerInfo.name;
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

		$("input").off("keydown").on("keydown", function(event) {
		    event.preventDefault();
		    const val = $(this).val()
		    if(event.key === "Backspace") return $(this).val(val.substr(0, val.length - 1))
		    if(event.key.length > 1) return;
		    $(this).val(val + event.key)
		});

	} else {
		ready(player);
	}

}
