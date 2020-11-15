import React from "react";
import { Card, CardActions, CardTitle } from "@photoncss/Card";
import { Button } from "@photoncss/Button";
import Markdown from "components/Markdown";
import { Col } from "@photoncss/Layout";
import MCText from "components/MCText";

export default function Package({ name, imageURL, expires, price, discount = 0, display_prefix, features }) {

	const rprice = price - discount;
	if(rprice <= 0) return null;

	return (
		<Col sm={12} md={6}>
			<Card>
				<CardTitle leadingImage={ imageURL }>
				  <MCText style={{ margin: 0 }}>{display_prefix.replace(/\&/gm, "§")}</MCText>
				  <h6 style={{
					  position: "absolute",
					  top: 2,
					  right: 16,
					  fontFamily: "Roboto Condensed",
				  }}>{ rprice <= 0 ? "":Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(rprice)}</h6>
				  { expires && <div className="text-red" style={{
					  fontSize: 14,
					  left: "50%",
					  fontFamily: "Roboto Condensed",
					  transform: "translateX(-50%)",
					  position: "absolute",
					  top: 10
				  }}>(Limited time only)</div> }
				</CardTitle>
				<hr/>
				<div className="b-top-btm">
					<Markdown source={features}/>
				</div>
				<hr style={{"marginTop":"-16px","width":"100%","marginLeft":"0"}}/>
				<CardActions>
					<Button variant="flat" color="accent" style={{ float: "right", margin: 0 }} onClick={ () => app.inAppPurchase({ player: store_specimen, name, price: rprice, display_prefix }) }>PURCHASE</Button>
				</CardActions>
			</Card>
		</Col>
	)
}
