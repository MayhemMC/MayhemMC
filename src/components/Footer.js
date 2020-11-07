import React, { Fragment } from "react";
import { Container, Row, Col } from "@photoncss/Layout";
import { Footer, FooterCopyright } from "@photoncss/Footer";

export default function Component() {
	return (
		<Fragment>
			<Footer variant="legacy dark">
				<Container>
					<div className="title"><h2>Mayhem MC</h2></div>
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
