import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import Markdown from "components/Markdown";
import { VoteList } from "components/PlayerList";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { ServerList } from "components/PlayerList";
import MCText from "components/MCText";

// Render view
function View() {

	// Initialize state
	const [ state, setState ] = useState({
	    success: null,
	    server: {
	        name_formatted: "",
	        name: "",
	        icon: "",
	        description: "",
	        plugins: {},
	        players: [],
	        online: 0,
	        limit: 0,
	        port: -1,
	        version: ""
	    }
	});

	// Fetch state
	useEffect(function() {
		const server = location.pathname.split("/server/")[1];
		if(state.server.name !== server.toLowerCase()) app.api("server", { server }).then(setState);
	})

	// If no server
	if(state.success === false) return <Redirect to="/"/>

	// Return default structure
	return (
		<Fragment>

			<Toolbar color="light-bg" variant="raised" size="contains-tabs" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle><MCText delimiter="&">{state.server.name_formatted}</MCText></ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					{ state.success === true && <ServerList spec={state.server.name}/> }

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/server/:server" }
