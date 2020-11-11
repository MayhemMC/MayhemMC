import React, { Fragment, useReducer, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "@photoncss/Drawer";
import { ListItem, Subheader } from "@photoncss/List";
import { stripFormats } from "minecraft-text";

const Route = ({ to, icon, children }) =>
  <Link to={to}><ListItem rounded leadingIcon={icon} active={app.getRoute() === to}>{children}</ListItem></Link>

export default function Component() {

	const [ i, forceUpdate ] = useReducer(x => x + 1, 0);
	i === 0 && Photon.hooks.push(forceUpdate);

	const [{ servers }, _servers ] = useState({ servers: {} });
	useEffect(() => Object.keys(servers).length === 0 && app.api("server").then(_servers));

	return (
		<Fragment>
			<Drawer id="web-nav">
				<img src={ app.static("icon.png") } alt="" style={{ margin: "0 auto", width: "66%" }}/>
				<hr/>
				<Route to="/" icon="home">Home</Route>
				<Route to="/store" icon="shopping_cart">Store</Route>
				{Object.keys(servers).length !== 0 && <Fragment>
					<hr/>
					<Subheader>Servers</Subheader>
					{Object.keys(servers).map(server => <Route to={`/server/${server}`} key={Object.keys(servers).indexOf(server)}>{stripFormats(servers[server].display_name, "&")}</Route>)}
				</Fragment>}
			</Drawer>
		</Fragment>
	)
}
