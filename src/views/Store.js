import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { List } from "@photoncss/List";
import Masonry from "react-masonry-component";
import { Player } from "components/PlayerList";
import Package from "components/Package";

global.store_specimen = null;

// Render view
function View() {

	const [{ packages }, _packages ] = useState({ packages: [] });
	const [{ donations }, _donations ] = useState({ donations: [] });
	useEffect(() => {
		donations.length === 0 && app.api("donations").then(_donations);
		packages.length === 0 && app.api("store").then(_packages);
	});

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
							<Icon style={{ display: "inline-block" }} waves={false}>info_outline</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: 40, fontWeight: "500", fontSize: "16px" }}>All packages are a one-time purchase and last <b>forever</b>.</span>
						</Card>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }}>
							<Icon style={{ display: "inline-block" }} waves={false}>info_outline</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: 40, fontWeight: "500", fontSize: "16px" }}>If you already have a package and are looking to upgrade, the price of the previous package will automaticly be subtracted from your total.</span>
						</Card>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }}>
							<Icon style={{ display: "inline-block" }} waves={false}>info_outline</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: 40, fontWeight: "500", fontSize: "16px" }}>All purchases are strictly non-refundable due to how PayPal handles donations.</span>
						</Card>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", padding: 16 }}>
							<Icon style={{ display: "inline-block" }} waves={false}>info_outline</Icon>
							<span style={{ lineHeight: "24px", verticalAlign: "middle", marginTop: "-24px", marginLeft: 40, fontWeight: "500", fontSize: "16px" }}>All packages are limited to cosmetic and quality of life enhancements due to <a href="https://www.minecraft.net/en-us/eula" className="text-primary">Mojang's TOS</a>.</span>
						</Card>
					</Col>

					<Col sm={12} lg={6}>
						<Row>
							<Masonry options={{ transitionDuration: 0 }}>
								{ packages.map((p, key) => <Package key={key} {...p}/> )}
							</Masonry>
						</Row>
					</Col>

					<Col sm={12} lg={3}>
						<Card style={{ margin: 4, width: "calc(100% - 8px)", overflow: "hidden" }}>
							<CardTitle>Recent Donations</CardTitle>
							<hr/>
							<List style={{ margin: "0 -1px" }}>
								{ donations.map((donation, key) => <Player name={donation.name} key={key}/> )}
							</List>
						</Card>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/store" }
