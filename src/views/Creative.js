import React from "react";

// Which path should this view render for
const route = "/creative";

import { Card } from "@photoncss/Card";
import { Container, Row, Col } from "@photoncss/Layout";
import Markdown from "components/Markdown";
import SchematicUpload from "components/SchematicUpload";

const View = () =>
	<React.Fragment>

		<Container>
			<Row>

				<Col sm={12}>
					<div className="title"><h2 style={{ fontSize: 36 }}>Creative</h2></div>
					<Card><Markdown source="creative"/></Card>
					<div className="title"><h2>Schematic Upload</h2></div>
					<SchematicUpload/>
					<div className="title"><h2>Dynmap</h2></div>
					<iframe frameborder="0" width="100%" height="800" src="/dynmap/creative/"></iframe>
				</Col>

			</Row>
		</Container>

	</React.Fragment>;

// Export View and route
export default { View, route }
