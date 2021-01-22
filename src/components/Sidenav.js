import React, { Fragment, useReducer, } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "@photoncss/Drawer";
import { ListItem } from "@photoncss/List";
// import { stripFormats } from "minecraft-text";

const Route = ({ to, icon, children }) =>
  <Link to={to}><ListItem rounded leadingIcon={icon} active={app.getRoute() === to}>{children}</ListItem></Link>

export default function Component() {

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

			</Drawer>
		</Fragment>
	)
}
