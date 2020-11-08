import React, { Fragment, useEffect, useState } from "react";
import { Card, CardActions, CardTitle } from "@photoncss/Card";
import { Button } from "@photoncss/Button";
import Markdown from "components/Markdown";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Textfield } from "@photoncss/Textfield";
import { List, ListItem } from "@photoncss/List";
import Masonry from "react-masonry-component";
import MCText from "mctext-react";

let specimen = null;

// Package component
export function Package({ name, imageURL, expires, price, discount = 0, display_prefix, features }) {

	const rprice = price - discount;
	if(rprice <= 0) return null;

	return (
		<Col sm={12} md={6}>
			<Card>
				<CardTitle leadingImage={ imageURL }>
				  <MCText>{display_prefix.replace(/\&/gm, "§")}</MCText>
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
				<hr style={{"marginTop":"-16px","width":"100%","marginLeft":"0"}}/>
				<div className="b-top-btm">
					<Markdown source={features}/>
				</div>
				<hr style={{"marginTop":"-16px","width":"100%","marginLeft":"0"}}/>
				<CardActions>
					<Button variant="flat" color="primary" style={{ float: "right", margin: 0 }} onClick={ () => app.inAppPurchase({ player: specimen, name, price: rprice, display_prefix }) }>PURCHASE</Button>
				</CardActions>
			</Card>
		</Col>
	)
}

// Render view
function View() {

	const [ discount, setDiscount ] = useState(0);
	const [{ packages }, _packages ] = useState({ packages: [] });
	const [{ donations }, _donations ] = useState({ donations: [] });
	useEffect(() => {
		donations.length === 0 && app.api("donations").then(_donations);
		packages.length === 0 && app.api("store").then(_packages);
	});

	async function checkdiscount({ target }) {

		const name = $(target).val();
		specimen = name;

		if(name === "") return setDiscount(0);
		if(name.length < 3 || name.length > 16) return;

		const playerInfo = await app.api("player", { name });

		if(playerInfo.success === false) return setDiscount(0);

		if(playerInfo.donator === false) return setDiscount(0);

		packages.map(({ name, price }) => {
			if(name.toUpperCase() === playerInfo.donator.package) {
				setDiscount(price);
			}
		})

	}

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">Store</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					<Col sm={12} lg={3}>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }} variant="outlined">
							<Icon style={{ display: "inline-block" }} waves={false}>local_offer</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: "2rem", fontWeight: "500", fontSize: "16px" }}>Enter your player name to log in and activate your personal discounts.</span>
							<div style={{ marginLeft: 24 }}>
								<Textfield label="Minecraft username" onKeyUp={checkdiscount}/>
							</div>
						</Card>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", overflow: "hidden" }} variant="outlined">
							<CardTitle>Recient Donations</CardTitle>
							<hr style={{"marginTop":"-16px","width":"100%","marginLeft":"0"}}/>
							<List style={{ margin: "0 -1px" }}>
							{ donations.map((donation, key) => {
								const rank = packages.filter(({ name }) => name.toUpperCase() === donation.package)[0];
								if(rank === undefined) return null;
								return (
									<ListItem key={key} waves={false}>
										<img src={`https://crafatar.com/avatars/${donation.uuid}?overlay=true`} alt="" style={{"height":"36px","width":"36px","display":"inline-block","marginRight":"12px","marginBottom":"-20px","transform":"translateY(-7px)", borderRadius: 4 }}/>
										<MCText>{`${rank.display_prefix} ${donation.name}`.replace(/\&/gm, "§")}</MCText>
									</ListItem>
								)
							} )}
							</List>
						</Card>
					</Col>

					<Col sm={12} lg={9}>
						<Row>
							<Masonry options={{ transitionDuration: 0 }}>
								{ packages.map((p, key) => <Package key={key} {...p} discount={discount}/> )}
							</Masonry>
						</Row>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/store" }
