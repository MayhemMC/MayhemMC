import React, { useEffect } from "react";
import { Col, Row, Container } from "@photoncss/Layout";
import { ServerList } from "components/PlayerList";
import { Button } from "@photoncss/Button";

export function Overview(server) {
	return (
		<Container>
			<Row>

				<Col sm={12} lg={4}>
					<ServerList spec={server.name}/>
				</Col>

			</Row>
		</Container>
	);
}

export function Plugins(server) {
	return (
		<Container>
			<Row>

				plugins

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
