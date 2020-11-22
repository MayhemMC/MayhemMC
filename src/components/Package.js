import React from "react";
import { renderToString } from "react-dom/server";
import { Card, CardActions, CardTitle } from "@photoncss/Card";
import { Button } from "@photoncss/Button";
import Markdown from "components/Markdown";
import { Col } from "@photoncss/Layout";
import MCText from "components/MCText";

export default function Package({ name, imageURL, expires, price, discount = 0, display_prefix, features }) {

	const rprice = price - discount;
	if(rprice <= 0) return null;

	function seeFeatures() {
		const dialog = new Photon.Dialog({
			type: "alert",
			transition: "grow",
			title: `The ${renderToString(<code><MCText style={{ fontSize: 16 }}>{display_prefix.replace(/\&/gm, "§")}</MCText></code>)} package includes:`,
			content: renderToString(<div style={{ maxHeight: "calc(100vh - 16px - 126px)", overflowY: "auto", marginTop: -28, borderTop: "1px solid #292b2f", borderBottom: "1px solid #292b2f" }}><Markdown source={features}/></div>),
			actions: [{
				name: "Purchase",
				click() {
					dialog.close();
					app.inAppPurchase({ player: store_specimen, name, price: rprice, display_prefix })
				}
			}, {
				name: "Close",
				click() {
					dialog.close()
				}
			}]
		});

		dialog.open();
	}

	return (
		<Col sm={12}>
			<Card>
				<CardTitle leadingImage={ imageURL }>
				  <MCText style={{ margin: 0 }}>{display_prefix.replace(/\&/gm, "§")}</MCText>
				  <h6 style={{
					  position: "absolute",
					  top: 2,
					  right: 16,
					  fontFamily: "Roboto Condensed",
				  }}>{ expires && <span className="text-red" style={{ paddingRight: 16 }}>(Offer ends soon)</span> }{ rprice <= 0 ? "":Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(rprice)}</h6>
				</CardTitle>
				<hr/>
				<CardActions>
					<Button variant="raised" color="primary" style={{ float: "right", margin: 0 }} onClick={ () => app.inAppPurchase({ player: store_specimen, name, price: rprice, display_prefix }) }>PURCHASE</Button>
					<Button variant="outlined" color="primary" style={{ float: "right" }} onClick={ () => seeFeatures() }>SEE FEATURES</Button>
				</CardActions>
			</Card>
		</Col>
	)
}
