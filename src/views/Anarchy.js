import React from "react";
import Gallery from "react-image-gallery";
// Which path should this view render for
const route = "/anarchy";

import { Card } from "@photoncss/Card";
import { Container, Row, Col } from "@photoncss/Layout";
import Markdown from "components/Markdown";

const View = () =>
	<React.Fragment>

		<Container>
			<Row>

				<Col sm={12}>
					<div className="title"><h2 style={{ fontSize: 36 }}>Anarchy</h2></div>
					<Card><Markdown source="anarchy"/></Card>
					<div className="title"><h2>Dynmap</h2></div>
					<iframe frameborder="0" width="100%" height="800" src="/dynmap/anarchy/"></iframe>
					<div className="title"><h2>Screenshots</h2></div>
					<Gallery
					  showThumbnails={false}
					  showFullscreenButton={false}
					  showPlayButton={false}
					  autoPlay={true}
					  slideDuration={300}
					  items={[
						{ original: app.static("ss/2020-06-16_07.34.00.png") },
						{ original: app.static("ss/2020-06-16_07.41.40.png") },
						{ original: app.static("ss/2020-06-16_07.45.11.png") },
						{ original: app.static("ss/2020-06-16_23.21.16.png") },
						{ original: app.static("ss/2020-06-21_22.44.10.png") },
					  ]}/>
				</Col>

			</Row>
		</Container>

	</React.Fragment>;

// Export View and route
export default { View, route }
