import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Textfield } from "@photoncss/Textfield";
import { List } from "@photoncss/List";
import Masonry from "react-masonry-component";
import { Player } from "components/PlayerList";
import Package from "components/Package";

global.store_specimen = null;

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
		global.store_specimen = name;

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

						<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }}>
							<Icon style={{ display: "inline-block" }} waves={false}>local_offer</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: "2rem", fontWeight: "500", fontSize: "16px" }}>Enter your player name to log in and activate your personal discounts.</span>
							<div style={{ marginLeft: 24 }}>
								<Textfield label="Minecraft username" onKeyUp={checkdiscount}/>
							</div>
						</Card>

						<Card style={{ margin: 4, width: "calc(100% - 8px)", overflow: "hidden" }}>
							<CardTitle>Recient Donations</CardTitle>
							<hr/>
							<List style={{ margin: "0 -1px" }}>
								{ donations.map((donation, key) => <Player name={donation.name} key={key}/> )}
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
