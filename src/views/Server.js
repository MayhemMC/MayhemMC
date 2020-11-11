import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Tabs, Tab, TabContent } from "@photoncss/Tabs";
import { stripFormats } from "minecraft-text";

// Render view
function View() {

	const [{ servers }, _servers ] = useState({ servers: {} });
	useEffect(() => Object.keys(servers).length === 0 && app.api("server").then(_servers));
	const server = servers[location.pathname.split("/server/")[1].toLowerCase()] || { online: false, display_name: "", description: "" };
	server.key = location.pathname.split("/server/")[1].toLowerCase();

	requestAnimationFrame(Photon.reload);
	$(".tabs").removeAttr("md");

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised contains-tabs" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">{stripFormats(server.display_name, "&")}</ToolbarTitle>
				{ server.online && (
					<Tabs>
						<Tab htmlFor={`${server.key}-about`}>about</Tab>
						{ /*
						<Tab htmlFor={`${server.key}-players`}>players</Tab>
						<Tab htmlFor={`${server.key}-plugins`}>plugins</Tab>*/ }
						{ server.plugins.filter(plugin => plugin.indexOf("dynmap") !== -1).length === 1 && <Tab htmlFor={`${server.key}-map`}>map</Tab> }
					</Tabs>
				)}
			</Toolbar>
			<ToolbarSpacer/>

			<TabContent id={`${server.key}-about`}>
				<Container>
					<Row>

						

					</Row>
				</Container>
			</TabContent>

			{ /*<TabContent id={`${server.key}-players`}></TabContent>
			<TabContent id={`${server.key}-plugins`}></TabContent>*/ }
			{ server.online && server.plugins.filter(plugin => plugin.indexOf("dynmap") !== -1).length === 1 && (
				<TabContent id={`${server.key}-map`}>
					<iframe src={`/dynmap/${server.key}`} frameBorder="0" className="full-frame" style={{ height: window.innerHeight - $("footer").height() - 128}}></iframe>
				</TabContent>
			)}

		</Fragment>
	)
}

// Export View and route
export default { View, route: "/server/:server" }
