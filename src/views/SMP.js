import React from "react";
import Gallery from "react-image-gallery";
// Which path should this view render for
const route = "/smp";

import { Card } from "@photoncss/Card";
import { Container, Row, Col } from "@photoncss/Layout";
import Markdown from "components/Markdown";

const View = () =>
	<React.Fragment>

		<Container>
			<Row>

				<Col sm={12}>
					<div className="title"><h2 style={{ fontSize: 36 }}>SMP</h2></div>
					<Card>
						<Markdown source="smp"/>
					</Card>
					<div className="title"><h2>Dynmap</h2></div>
					<iframe frameborder="0" width="100%" height="800" src="/dynmap/smp/"></iframe>
					<div className="title"><h2>Screenshots</h2></div>
					<Gallery
					  showThumbnails={false}
					  showFullscreenButton={false}
					  showPlayButton={false}
					  autoPlay={true}
					  slideDuration={300}
					  items={[
						{ original: app.static("ss/2020-07-12_00.21.47.png") },
						{ original: app.static("ss/2020-07-12_22.28.22.png") },
						{ original: app.static("ss/2020-07-12_22.26.09.png") },
						{ original: app.static("ss/2020-07-12_22.27.03.png") },
						{ original: app.static("ss/2020-07-12_22.27.52.png") },
					  ]}/>
				</Col>

			</Row>
		</Container>

	</React.Fragment>;

// Export View and route
export default { View, route }
