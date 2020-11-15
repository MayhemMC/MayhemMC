import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Card, CardTitle } from "@photoncss/Card";
import Markdown from "components/Markdown";
import PlayerList from "components/PlayerList";

(function animation(){
	$("#x-parallax").css("transform", `translateY(${ $(window).scrollTop()/1.2 }px) scale(${ Math.max(1 - $(window).scrollTop()/1920, .4) })`)
	$("#x-parallax").css("opacity", `${ (100 - $(window).scrollTop()/4)/100 }`)
	requestAnimationFrame(animation);
}());

// Render view
function View() {


	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle>Mayhem MC</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					<Col>
						<Card style={{ overflow: "hidden", zIndex: -1, position: "relative" }} id="x-parallax">
							<img src={app.static("banner.jpg")} alt="" style={{ width: "100%", height: "100%" }}/>
						</Card>
					</Col>

					<Col sm={12} lg={4}>
						<PlayerList/>
					</Col>

					<Col sm={12} lg={8}>
						<Card>
							<Markdown source={require("../../docs/index.md").default}/>
						</Card>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/" }
