import React, { Fragment } from "react";
import { Card } from "@photoncss/Card";
import { Col, Container, Row } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";

$(window).scroll(_event => {
	$("#x-parallax").css("transform", `translateY(${ $(window).scrollTop()/1.2 }px) scale(${ Math.max(1 - $(window).scrollTop()/1920, .4) })`)
	$("#x-parallax").css("opacity", `${ (100 - $(window).scrollTop()/4)/100 }`)
});

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

					<Col sm={12}>
						<Card style={{ overflow: "hidden", zIndex: -1, position: "relative" }} id="x-parallax">
							<img src={app.static("banner.jpg")} alt="" style={{ width: "100%", height: "100%" }}/>
						</Card>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/" }
