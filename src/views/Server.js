import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "@photoncss/Layout";
import { Card, CardTitle } from "@photoncss/Card";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { List, ListItem } from "@photoncss/List";
import { Tabs, Tab, TabContent } from "@photoncss/Tabs";
import { stripFormats } from "minecraft-text";
import MCText from "components/MCText";
import Markdown from "components/Markdown";

export function Player({ name }) {
	const [ player, _player ] = useState(null);
	useEffect(() => player === null && app.api("player", { name }).then(_player));
	if(player === null) return null;
	return (
		<ListItem waves={false}>
			<img src={`https://crafatar.com/avatars/${player.uuid}?overlay=true`} alt="" style={{"height":"36px","width":"36px","display":"inline-block","marginRight":"12px","marginBottom":"-20px","transform":"translateY(-7px)", borderRadius: 4 }}/>
			<MCText style={{ display: "inline-block" }} delimiter="&">{`${player.donator !== false ? player.donator.display_prefix + " ":""}${player.name}`}</MCText>
		</ListItem>
	)
}

// Render view
function View() {

	const [{ servers }, _servers ] = useState({ servers: {} });
	useEffect(() => Object.keys(servers).length === 0 && app.api("server").then(_servers));
	const server = servers[location.pathname.split("/server/")[1].toLowerCase()] || { online: false, display_name: "", description: "" };
	server.key = location.pathname.split("/server/")[1].toLowerCase();

	requestAnimationFrame(Photon.reload);
	$(".tabs").removeAttr("md");

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised contains-tabs" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">{stripFormats(server.display_name, "&")}</ToolbarTitle>
				{ server.online && (
					<Tabs>
						<Tab htmlFor={`${server.key}-about`}>about</Tab>
						{ /*
						<Tab htmlFor={`${server.key}-players`}>players</Tab>
						<Tab htmlFor={`${server.key}-plugins`}>plugins</Tab>*/ }
						{ server.plugins.filter(plugin => plugin.indexOf("dynmap") !== -1).length === 1 && <Tab htmlFor={`${server.key}-map`}>dynmap</Tab> }
					</Tabs>
				)}
			</Toolbar>
			<ToolbarSpacer/>

			<TabContent id={`${server.key}-about`}>
				<Container>
					<Row>
						<Col lg={4}>
							<Card>
								<CardTitle>
									<MCText delimiter="&">{server.display_name}</MCText>
								</CardTitle>
								<div style={{ padding: 24, paddingTop: 0 }}>
									<MCText delimiter="&">{server.description}</MCText>
								</div>
							</Card>
							<Card>
								<CardTitle>Server Info</CardTitle>
								{ server.plugins !== undefined && (
									<p style={{ marginTop: -12 }}>
										<div><b>Status</b><span style={{ float: "right" }}>{server.online ? <span className="text-green text-accent-2">Online</span>:<span className="text-red text-accent-2">Offline</span>}</span></div>
										<div><b>Server Version</b><span style={{ float: "right" }}>{server.version}</span></div>
										<div><b>RAM</b><span style={{ float: "right" }}>{server.max_memory}</span></div>
										<div><b>Players (All Time)</b><span style={{ float: "right" }}>{server.unique_joins}</span></div>
									</p>
								)}
							</Card>
							{ server.online && (
								<Card>
									<CardTitle>Players</CardTitle>
									<h3 style={{ fontWeight: 300, textAlign: "center" }}>{server.players.length} / {server.max_players}</h3>
									<hr style={{ margin: 0, width: "100%" }}/>
									<List>
										{ server.players.map((name, key) => <Player name={name} key={key}/> )}
									</List>
								</Card>
							) }
						</Col>
						<Col lg={8}>
							<Card>
								<Markdown source={require(`../../docs/server/${server.key}.md`).default}/>
							</Card>
						</Col>
					</Row>
				</Container>
			</TabContent>

			{ /*<TabContent id={`${server.key}-players`}></TabContent>
			<TabContent id={`${server.key}-plugins`}></TabContent>*/ }
			{ server.online && server.plugins.filter(plugin => plugin.indexOf("dynmap") !== -1).length === 1 && (
				<TabContent id={`${server.key}-map`}>
					<iframe src={`/dynmap/${server.key}`} frameBorder="0" className="full-frame" style={{ height: window.innerHeight - $("footer").height() - 128}}></iframe>
				</TabContent>
			)}

		</Fragment>
	)
}

// Export View and route
export default { View, route: "/server/:server" }
