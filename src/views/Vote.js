import React, { Fragment, useEffect, useState } from "react";
import { Card } from "@photoncss/Card";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import Markdown from "components/Markdown";
import { VoteList } from "components/PlayerList";


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

					<Col sm={12} lg={4}>
						<VoteList/>
					</Col>

					<Col sm={12} lg={8}>
						<Card>
							<Markdown source={require("../../docs/vote.md").default}/>
						</Card>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/vote" }
