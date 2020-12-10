import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "@photoncss/Layout";
import { Card, CardTitle } from "@photoncss/Card";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Button } from "@photoncss/Button";
import { Tabs, Tab, TabContent } from "@photoncss/Tabs";
import { stripFormats } from "minecraft-text";
import MCText from "components/MCText";
import PlayerList from "components/PlayerList";
import Markdown from "components/Markdown";

let __key = null;

// Render view
function View() {

	const urlKey = location.pathname.split("/server/")[1].toLowerCase()
	const [ server, _server ] = useState({ display_name: urlKey, description: "" })

	function resolve() {
		app.api("server", { server: urlKey }).then(_server);
	}

	useEffect(() => {
		if(__key !== urlKey) {
			_server({ display_name: urlKey, description: "" })
			resolve()
			__key = urlKey;
		}
		const interval = setInterval(resolve, 1000)
		return function() {
			clearInterval(interval);
		}
	});

	server.key = urlKey;

	requestAnimationFrame(Photon.reload);
	$(".tabs").removeAttr("md");

	const dynmapid = Photon.guid();
	$(window).resize(() => $(`#${dynmapid}`).css({ height: window.innerHeight - $("footer").height() - 128 }));
	requestAnimationFrame(() => $(`#${dynmapid}`).css({ height: window.innerHeight - $("footer").height() - 128 }))

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised contains-tabs" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">{stripFormats(server.display_name, "&")}</ToolbarTitle>
					<Tabs>
						<Tab htmlFor={`${server.key}-about`}>about</Tab>
						<Tab htmlFor={`${server.key}-map`} active={location.search.includes("dynmap")}>dynmap</Tab>
					</Tabs>
			</Toolbar>
			<ToolbarSpacer/>

			<TabContent id={`${server.key}-about`}>
				<Container>
					<Row>

						<Col>
							<Card style={{ overflow: "hidden", zIndex: -1, position: "relative" }} id="x-parallax">
								<img src={app.static(urlKey + "banner.jpg")} alt="" style={{ width: "100%", height: "100%" }}/>
							</Card>
						</Col>

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
								<div style={{ marginTop: -12, padding: 16, opacity: .7 }}>
									<div><b>Status</b><span style={{ float: "right" }}>{server.online ? <span className="text-green text-accent-2">Online</span>:<span className="text-red text-accent-2">Offline</span>}</span></div>
									{ server.online && <div><b>Server Version</b><span style={{ float: "right" }}>{server.version}</span></div> }
									{ server.online && <div><b>RAM</b><span style={{ float: "right" }}>{server.max_memory}</span></div> }
									{ server.online && <div><b>Players (All Time)</b><span style={{ float: "right" }}>{server.unique_joins}</span></div> }
									{ server.online && <div><b>Plugins</b><span style={{ float: "right" }}>{server.plugins.length}</span></div> }
								</div>
							</Card>
							{ server.online && <PlayerList only={server.key}/> }
						</Col>
						<Col lg={8}>
							<Card>
								<Markdown source={require(`../../docs/server/${urlKey}.md`).default}/>
							</Card>
						</Col>
					</Row>
				</Container>
			</TabContent>

			<TabContent id={`${server.key}-map`} style={{ position: "relative" }}>
				<iframe src={`/dynmap/${server.key}/#`} frameBorder="0" className="full-frame" id={dynmapid} style={{ zIndex: 1 }}></iframe>
				<Button variant="raised" style={{ position: "absolute", right: 8, bottom: 8, zIndex: 2 }} onClick={ () => $(`#${server.key}-map`).toggleClass("fullscreen")}>fullscreen</Button>
			</TabContent>

		</Fragment>
	)
}

// Export View and route
export default { View, route: "/server/:server" }
