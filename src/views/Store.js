import React, { useState, useEffect, Fragment } from "react";

// Which path should this view render for
const route = "/store";

import Markdown from "components/Markdown";
import Navbar from "components/Navbar";
import { Button } from "@photoncss/Button";
import { Card, CardTitle, CardActions } from "@photoncss/Card";
import { Icon } from "@photoncss/Icon";
import { Container, Row, Col } from "@photoncss/Layout";
import { Spinner } from "@photoncss/Progress";
import { Textfield } from "@photoncss/Textfield";
import Masonry from "react-masonry-component";

let specimen = null;

function Package({ name, imageUrl, expires, price, discount = 0 }) {
	const [ BTC, setBTC ] = useState(null);
	const rprice = price - discount;

	useEffect(function() {
		app.query().then(result => setBTC(rprice/result.btcvalue));
	});

	if(rprice <= 0) return null;
	return (
		<Col sm={12} md={6}>
			<Card>
				<CardTitle leadingImage={ imageUrl }>
				  { name }
				  <h6 style={{
					  position: "absolute",
					  top: 2,
					  left: "50%",
					  fontFamily: "Roboto Condensed",
					  transform: "translateX(-50%)"
				  }}>{ rprice <= 0 ? "":Intl.NumberFormat(navigator.language, { style: "currency", currency: "USD" }).format(rprice) + ` / ~${Math.ceil(BTC*100000)/100000} BTC`}</h6>
				  { expires && <div className="text-red" style={{
					  fontSize: 14,
					  fontFamily: "Roboto Condensed",
					  position: "absolute",
					  top: 10,
					  right: 16
				  }}>(Limited time only)</div> }
				</CardTitle>
				<div className="b-top-btm">
					<Markdown source={`dperks/${name.toLowerCase()}`}/>
				</div>
				<CardActions>
					<Button variant="flat" color="accent" style={{ float: "right", margin: 0 }} onClick={ () => app.inAppPurchase({ player: specimen, name, price: rprice, BTC }) }>PURCHASE</Button>
				</CardActions>
			</Card>
		</Col>
	)
}

function View() {
	const [ store, setStore ] = useState(false);
	const [ discount, setDiscount ] = useState(0);
	useEffect(function() { store === false && app.query().then(({ store }) => setStore(store)) });
	requestAnimationFrame(Photon.reload);
	const checkdiscount = ({ target }) => {
		const playername = $(target).val();
		specimen = playername;
		setDiscount(0);
		store.donators.map(donator => {
			if(donator.name.toLowerCase() === playername.toLowerCase()) {
				store.packages.map(p => {
					if(p.name.toLowerCase() === donator.package.toLowerCase()) {
						setDiscount(p.price)
					}
				})
			}
		})
	}
	return (
		<Fragment>
			<Navbar>Store</Navbar>
			{ store === false && <center style={{ padding: 36 }}>
				<Spinner/>
			</center> }
			{ store !== false && (
				<Container>
					<Row>

						<Col sm={12} lg={3}>
							<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }} variant="outlined">
								<Icon style={{ display: "inline-block" }}>info_outline</Icon>
								<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: "2rem", fontWeight: "500", fontSize: "16px" }}>All donators get their Discord role and access to the donator-only channels on the Discord server.</span>
							</Card>
							<Card style={{ borderColor: "#FFB300", color: "#FFB300", margin: 4, width: "calc(100% - 8px)", padding: 16 }} variant="outlined">
								<Icon style={{ display: "inline-block" }}>help_outline</Icon>
								<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: "2rem", fontWeight: "500", fontSize: "16px" }}>Packages are discounted for players who have already donated.</span>
							</Card>
							<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }} variant="outlined">
								<Icon style={{ display: "inline-block" }}>info_outline</Icon>
								<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: "2rem", fontWeight: "500", fontSize: "16px" }}>Enter your player name to see if you're eligible for any discounts.</span>
								<div style={{ marginLeft: 24 }}>
									<Textfield label="Minecraft username" onKeyUp={checkdiscount}/>
								</div>
							</Card>
						</Col>
						<Col sm={12} lg={9}>
							<Row>
								<Masonry>
									{ store.packages.map((p, key) => <Package key={key} {...p} discount={discount}/> )}
								</Masonry>
							</Row>
						</Col>
					</Row>
				</Container>
			) }
		</Fragment>
	)
}

// Export View and route
export default { View, route }
