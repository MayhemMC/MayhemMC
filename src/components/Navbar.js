import React, { Fragment, useReducer } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "@photoncss/Drawer";
import { Icon } from "@photoncss/Icon";
import { ListItem, Subheader } from "@photoncss/List";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";

const Route = ({ to, icon, children }) =>
  <Link to={to}><ListItem rounded leadingIcon={icon} active={app.getRoute() === to}>{children}</ListItem></Link>

export default function Component({ children }) {

	const [ i, forceUpdate ] = useReducer(x => x + 1, 0);
	i === 0 && Photon.hooks.push(() => {
		forceUpdate();
		Photon.Drawer("#web-nav").close()
	});

	return (
		<Fragment>

			<Drawer id="web-nav">
				<img src={ app.static("icon.png") } alt="" style={{ margin: "0 auto", width: "66%" }}/>
				<hr/>
				<Route to="/" icon="home">Home</Route>
				<a href="https://docs.google.com/forms/d/e/1FAIpQLSfKGLtE_wxBn0dsYRbTgGqzsIiHS7RSMcZMtQiZTYWen9042A/viewform" target="_blank"><ListItem rounded leadingIcon="help_outline">Feedback & Suggestions</ListItem></a>
				<Route to="/store" icon="shopping_cart">Store</Route>
				<Subheader style={{ color: "#e1e1e1" }}>Servers</Subheader>
				<Route to="/anarchy" icon="radio_button_unchecked">Anarchy</Route>
				<Route to="/creative" icon="radio_button_unchecked">Creative</Route>
				<Route to="/factions" icon="radio_button_unchecked">Factions</Route>
				<Route to="/smp" icon="radio_button_unchecked">SMP</Route>
			</Drawer>

			<Toolbar color="primary" position="fixed">
				<Icon onClick={ () => Photon.Drawer("#web-nav").open() }>menu</Icon>
				<ToolbarTitle subtitle={children ? "Mayhem MC" : false}>{children || "Mayhem MC"}</ToolbarTitle>
			</Toolbar>

			<ToolbarSpacer/>

		</Fragment>
	)
}
