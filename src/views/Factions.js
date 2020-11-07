import React from "react";
import Gallery from "react-image-gallery";
// Which path should this view render for
const route = "/factions";

import { Card } from "@photoncss/Card";
import { Container, Row, Col } from "@photoncss/Layout";
import Markdown from "components/Markdown";

const View = () =>
	<React.Fragment>

		<Container>
			<Row>

				<Col sm={12}>
					<div className="title"><h2 style={{ fontSize: 36 }}>Factions</h2></div>
					<Card><Markdown source="factions"/></Card>
					<div className="title"><h2>Dynmap</h2></div>
					<iframe frameborder="0" width="100%" height="800" src="/dynmap/factions/"></iframe>
					<div className="title"><h2>Screenshots</h2></div>
					<Gallery
					  showThumbnails={false}
					  showFullscreenButton={false}
					  showPlayButton={false}
					  autoPlay={true}
					  slideDuration={300}
					  items={[
						{ original: app.static("ss/2020-06-15_20.36.37.png") },
						{ original: app.static("ss/2020-06-16_23.14.51.png") },
						{ original: app.static("ss/2020-06-15_20.37.10.png") },
						{ original: app.static("ss/2020-06-15_20.38.50.png") },
						{ original: app.static("ss/2020-06-15_20.41.32.png") },
						{ original: app.static("ss/2020-06-16_23.12.17.png") },
						{ original: app.static("ss/2020-06-16_23.19.46.png") },
					  ]}/>
				</Col>

			</Row>
		</Container>

	</React.Fragment>;

// Export View and route
export default { View, route }
