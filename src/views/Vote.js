import React, { Fragment } from "react";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import Markdown from "components/Markdown";
import { VoteList } from "components/PlayerList";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";

export function VoteLinks() {

	const links = [
		"https://minecraftservers.org/vote/583568",
		"https://minecraft-server-list.com/server/459450/vote/",
		"https://minecraft-mp.com/server/255961/vote/",
		"https://topg.org/Minecraft/in-605738"
	];

	return (
		<Card>
			<CardTitle>Vote Links</CardTitle>
			<hr/>
			<List style={{ borderLeft: 0, borderRight: 0 }}>
				{ links.map((link, key) => (
					<a href={link} target="_blank" key={key}>
						<ListItem leadingIcon="link">Vote Link #{key+1}</ListItem>
					</a>
				))}
			</List>
		</Card>
	)
}


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
						<VoteLinks/>
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
