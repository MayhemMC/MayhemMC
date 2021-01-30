import React, { useEffect } from "react";
import { Col, Row, Container } from "@photoncss/Layout";
import { ServerList } from "components/PlayerList";
import { Button } from "@photoncss/Button";
import { Card, CardTitle } from "@photoncss/Card";
import Markdown from "components/Markdown";

export function Overview(server) {
	return (
		<Container>
			<Row>

				<Col sm={12} lg={4} xl={3}>
					<ServerList spec={server.name}/>
				</Col>

				<Col sm={12} lg={8} xl={9}>
					{ server.about !== null && <Markdown source={server.about}/> }
				</Col>

			</Row>
		</Container>
	);
}

export function Plugins(server) {

	const MY_PLUGINS = ["bigauction", "bossgamble", "toggleadmin", "nonetherroof"]

	function Plugin({ name, version }) {
		const isCustom = MY_PLUGINS.indexOf(name.toLowerCase()) > -1;
		return (
			<Card>
				<CardTitle subtitle={ isCustom ? "Custom for Mayhem MC" : "" } style={{ color: isCustom ? "#ffb74d" : ""}}>
					<span>{name}</span>
					<span style={{ float: "right", fontFamily: "roboto condensed", opacity: 0.78 }}>{version}</span>
				</CardTitle>
			</Card>
		)
	}

	return (
		<Container>
			<Row>
				<Col sm={12} md={10} lg={8} xl={6}>{
					Object.keys(server.plugins)
					  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
					  .map(plugin =>
						<Plugin name={plugin} version={server.plugins[plugin]}/>
					  )
				}</Col>
			</Row>
		</Container>
	);
}

export function Dynmap(server) {

	// Generate uuid
	const uuid = Photon.guid();

	// Make sure dynmap fills window
	useEffect(function() {
		$(window).on("resize", () => $(`#${uuid}`).css({ height: window.innerHeight - $("footer").height() - 128 }));
		requestAnimationFrame(() => $(`#${uuid}`).css({ height: window.innerHeight - $("footer").height() - 128 }))
		return () => $(window).off("resize");
	})

	// Return structure
	return (
		<div style={{ position: "relative" }}>
			<iframe src={`/dynmap/${server.name}/#`} frameBorder="0" className="full-frame" id={uuid}></iframe>
			<a href={`//${location.hostname}${location.port === "" ? "" : ":" + location.port}/dynmap/${server.name}/`} target="_blank">
				<Button variant="raised" style={{ position: "absolute", right: 8, bottom: 8 }}>fullscreen</Button>
			</a>
		</div>
	);
}
