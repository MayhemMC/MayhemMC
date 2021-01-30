import React, { useEffect } from "react";
import { Col, Row, Container } from "@photoncss/Layout";
import { ServerList } from "components/PlayerList";
import { Button } from "@photoncss/Button";
import { Card, CardTitle } from "@photoncss/Card";
import Markdown from "components/Markdown";
import MCText from "components/MCText";
import dayjs from "dayjs";

export function Overview(server) {

	function StatLine({ title, children }) {
		return (
			<div>
				<b>{title}</b>
				<span style={{ float: "right" }}>{children}</span>
			</div>
		)
	}

	return (
		<Container>
			<Row>

				<Col sm={12} lg={4} xl={3}>

					<Card>
						<p style={{ opacity: 1 }}>
							<MCText delimiter="&">{server.description_formatted}</MCText>
						</p>
					</Card>

					<Card>
						<CardTitle>Server Stats</CardTitle>
						<p style={{ paddingTop: 0 }}>
							<StatLine title="First Opened">{dayjs(server.available_since).format("MM/DD/YYYY hh:mm a")}</StatLine>
							<StatLine title="Memory">{server.memory_formatted}</StatLine>
							<StatLine title="Players (all time)">{server.uniqueJoins}</StatLine>
							<StatLine title="Server Version">{server.version}</StatLine>
							<StatLine title="World Size">{server.size_formatted}</StatLine>
						</p>
					</Card>

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
