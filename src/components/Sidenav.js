import React, { Fragment, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "@photoncss/Drawer";
import { ListItem, Subheader } from "@photoncss/List";
import MCText from "components/MCText";
// import { stripFormats } from "minecraft-text";

const Route = ({ to, icon, children }) =>
  <Link to={to}><ListItem rounded leadingIcon={icon} active={app.getRoute() === to}>{children}</ListItem></Link>

// Initialize applicable servers list
let applicable_servers = null;

export default function Component() {

	// Initialize state
	const [ state, setState ] = useState(applicable_servers);

	// Fetch state
	if(state === null) app.api("servers").then(newState => {
		applicable_servers = newState;
		setState(newState);
	});

	// Rerender component on Photon reload
	const [ i, forceUpdate ] = useReducer(x => x + 1, 0);
	i === 0 && Photon.hooks.push(forceUpdate);

	return (
		<Fragment>
			<Drawer id="web-nav">
				<img src={ app.static("icon-transparent.png") } alt="" style={{ margin: "0 auto", width: "66%" }}/>
				<hr/>
				<Route to="/" icon="home">Home</Route>
				<a href="//joshmerlino.github.io/performance" target="_blank"><ListItem rounded leadingIcon="speed">Server Performance</ListItem></a>
				<Route to="/vote" icon="how_to_vote">Vote</Route>
				<Route to="/store" icon="shopping_cart">Web Store</Route>
				<hr/>
				<Subheader>Servers</Subheader>
				{ state !== null && (
					state.servers.filter(({ server }) => server !== "lobby").map(server =>
						<Route to={`/server/${server.server}`}><MCText delimiter="&">{server.name_formatted}</MCText></Route>
					)
				) }
			</Drawer>
		</Fragment>
	)
}
