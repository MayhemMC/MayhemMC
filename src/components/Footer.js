import React, { Fragment } from "react";
import { Container, Row, Col } from "@photoncss/Layout";
import { Footer, FooterCopyright } from "@photoncss/Footer";
import DiscordInvite from "components/DiscordInvite";

export default function Component() {
	return (
		<Fragment>
			<Footer variant="legacy dark">
				<Container>
					<Row style={{ marginTop: 4 }}>
						<Col lg={8}>
							<img src={app.static("icon.png")} alt="" width="72" style={{ display: "inline-block", marginRight: 16, marginBottom: -32, borderRadius: 8 }}/>
							<div className="title" style={{ display: "inline-block" }}><h2>Mayhem MC</h2></div>
						</Col>
						<Col lg={4}>
							<div style={{ alignItems: "right", marginTop: 8, marginBottom: -4 }}>
								<DiscordInvite/>
							</div>
						</Col>
					</Row>
				</Container>
				<FooterCopyright>
					<Container>
						Copyright © { new Date().getFullYear() } Mayhem MC - Designed by <a href="//joshmerlino.github.io" className="link">Josh Merlino</a><br/>
						Not affiliated with Minecraft or Mojang in any way.
					</Container>
				</FooterCopyright>
			</Footer>
		</Fragment>
	)
}
