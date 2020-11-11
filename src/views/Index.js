import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Card, CardTitle } from "@photoncss/Card";
import Markdown from "components/Markdown";
import { List, ListItem } from "@photoncss/List";
import MCText from "components/MCText";

(function animation(){
	$("#x-parallax").css("transform", `translateY(${ $(window).scrollTop()/1.2 }px) scale(${ Math.max(1 - $(window).scrollTop()/1920, .4) })`)
	$("#x-parallax").css("opacity", `${ (100 - $(window).scrollTop()/4)/100 }`)
	requestAnimationFrame(animation);
}());

export function Player({ name, server }) {
	const [ player, _player ] = useState(null);
	useEffect(() => player === null && app.api("player", { name }).then(_player));
	if(player === null) return null;
	return (
		<ListItem waves={false} subtitle={`Playing ${server}`}>
			<img src={`https://crafatar.com/avatars/${player.uuid}?overlay=true`} alt="" style={{"height":"36px","width":"36px","display":"inline-block","marginRight":"12px","marginBottom":"-20px", borderRadius: 4 }}/>
			<MCText style={{ display: "inline-block" }} delimiter="&">{`${player.donator !== false ? player.donator.display_prefix + " ":""}${player.name}`}</MCText>
		</ListItem>
	)
}

// Render view
function View() {

	const [ server, _server ] = useState(null);
	useEffect(() => server === null && app.api("server").then(_server));

	const online = [];
	if(server !== null) Object.keys(server.servers).map(s => server.servers[s].players !== false && server.servers[s].players.map(name => online.push({ name, server: s })));

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle>Mayhem MC</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					<Col>
						<Card style={{ overflow: "hidden", zIndex: -1, position: "relative" }} id="x-parallax">
							<img src={app.static("banner.jpg")} alt="" style={{ width: "100%", height: "100%" }}/>
						</Card>
					</Col>

					<Col sm={12} lg={4}>
						{ server !== null && (
							<Card>
								<CardTitle>Players</CardTitle>
								<h3 style={{ fontWeight: 300, textAlign: "center" }}>{online.length} / {server.max_players}</h3>
								<hr style={{ margin: 0, width: "100%" }}/>
								<List>
									{ online.map(({ name, server }, key) => <Player name={name} server={server} key={key}/> )}
								</List>
							</Card>
						) }
					</Col>

					<Col sm={12} lg={8}>
						<Card>
							<Markdown source={require("../../docs/index.md").default}/>
						</Card>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/" }
