import React from "react";

// Which path should this view render for
const route = "/";

import { Card } from "@photoncss/Card";
import { Container, Row, Col } from "@photoncss/Layout";

import Markdown from "components/Markdown";
import PlayerList from "components/PlayerList";
import VoteLinks from "components/VoteLinks";
import DiscordInvite from "components/DiscordInvite";
import WebInstaller from "components/WebInstaller";
import PWAInstaller from "components/PWAInstaller";

$(window).scroll(_event => {
	$("#x-parallax").css("transform", `translateY(${ $(window).scrollTop()/1.2 }px) scale(${ Math.max(1 - $(window).scrollTop()/1920, .4) })`)
	$("#x-parallax").css("opacity", `${ (100 - $(window).scrollTop()/4)/100 }`)
});

const View = () =>
	<React.Fragment>

		<Container>
			<Row>

				<Col sm={12}>
					<Card style={{ overflow: "hidden", zIndex: -1, position: "relative" }} id="x-parallax">
						<img src={app.static("banner.jpg")} alt="" style={{ width: "100%", height: "100%" }}/>
					</Card>
				</Col>

				<Col sm={12} xl={3}>
					<DiscordInvite inviteCode="4FBnfPA"/>
					<WebInstaller install><PWAInstaller/></WebInstaller>
					<VoteLinks/>
				</Col>

				<Col sm={12} xl={6}>
					<Card>
						<Markdown source="index"/>
					</Card>
				</Col>

				<Col sm={12} xl={3}>
					<PlayerList/>
				</Col>

			</Row>
		</Container>

	</React.Fragment>;

// Export View and route
export default { View, route }
