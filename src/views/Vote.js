import React, { Fragment, useEffect, useState } from "react";
import { Card } from "@photoncss/Card";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import TopVoters from "components/TopVoters";
import VoteLinks from "components/VoteLinks";
import Markdown from "components/Markdown";

// Render view
function View() {

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">Vote</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					<Col sm={12} lg={3}>
						<VoteLinks/>
					</Col>

					<Col sm={12} lg={6}>
						<Card>
							<Markdown source={require("../../docs/vote.md").default}/>
						</Card>
					</Col>

					<Col sm={12} lg={3}>
						<TopVoters/>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/vote" }
