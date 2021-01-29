import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Tab, Tabs, TabContent } from "@photoncss/Tabs";
import MCText from "components/MCText";

import { Overview, Dynmap, Plugins } from "components/Server";

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
		const server = location.pathname.split("/server/")[1].split("/")[0];
		const tab = location.pathname.split(`/server/${server}`)[1].split("/")[1] || "overview";
		if(state.server.name !== server.toLowerCase()) app.api("server", { server }).then(newState => {
			requestAnimationFrame(() => {
				Photon.reload();
				setTimeout(() => {
					const setTab = ["overview", "plugins", "dynmap"].indexOf(tab.toLowerCase());
					$(".tabs").children(".tab").eq(setTab).click();
				}, 10);
			});

			setState(newState);
		});
	})

	// If state pending
	if(state.success === null) return null;

	// If no server
	if(state.success === false) return <Redirect to="/"/>;

	// Push new URL to tab
	function push({ target }) {
		let tab = $(target).attr("for");
			tab = tab === "overview" ? "" : `/${tab}`;
		const url = `/server/${state.server.name}${tab}`;
		history.pushState(null, null, url);
	}

	// Return default structure
	return (
		<Fragment>

			<Toolbar color="light-bg" variant="raised" size="contains-tabs" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle><MCText delimiter="&">{state.server.name_formatted}</MCText></ToolbarTitle>
				<Tabs>
					<Tab htmlFor="overview" onClick={push}>Overview</Tab>
					<Tab htmlFor="plugins" onClick={push}>Plugins ({Object.keys(state.server.plugins).length})</Tab>
					{ state.server.plugins.hasOwnProperty("dynmap") && <Tab htmlFor="dynmap" onClick={push}>Dynmap</Tab> }
				</Tabs>
			</Toolbar>
			<ToolbarSpacer/>

				<TabContent id="overview">
					<Overview {...state.server}/>
				</TabContent>

				<TabContent id="plugins">
					<Plugins {...state.server}/>
				</TabContent>

				<TabContent id="dynmap">
					<Dynmap {...state.server}/>
				</TabContent>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/server/:server?/:tab" }
