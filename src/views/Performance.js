import React, { Fragment, useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Card, CardTitle } from "@photoncss/Card";
import { Col, Container, Row, VHAlign } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { Spinner } from "@photoncss/Progress";
import Masonry from "react-masonry-component";

// Render view
function View() {

	// Initialize default state
	const [ state, setState ] = useState({ success: false, error: "Loading..." });

	// Resolve method
	const resolve = () => app.api("performance").then(setState);

	// Set resolve on interval
	useEffect(function() {
		const interval = setInterval(resolve, 1000)
		return function() {
			clearInterval(interval);
		}
	})

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">Server Performance</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					{ state.success ? (
						<Masonry>

							<Col sm={12} md={6} lg={4} xl={3}>
								<Card>
									<CardTitle subtitle={state.cpu.model}>CPU</CardTitle>
									<hr/>
									<Row style={{ margin: 0 }}>
										<Col sm={9}>
											<div style={{ margin: 16 }}>
												<div><b>Clock Speed</b><span style={{ float: "right" }}>{state.cpu.speed}</span></div>
												<div><b>Core Temp</b><span style={{ float: "right" }}>{state.cpu.temp}</span></div>
											</div>
										</Col>
										<Col sm={3}>
											<div style={{ height: 72, width: 72, margin: 16, float: "right" }} className="prog-blue">
												<CircularProgressbar value={state.cpu.usage} maxValue={1} text={`${Math.floor(state.cpu.usage * 100)}%`} />
											</div>
										</Col>
									</Row>
								</Card>
							</Col>

							<Col sm={12} md={6} lg={4} xl={3}>
								<Card>
									<CardTitle subtitle={`${state.mem.total} ${state.mem.dimm}`}>MEMORY</CardTitle>
									<hr/>
									<Row style={{ margin: 0 }}>
										<Col sm={9}>
											<div style={{ margin: 16 }}>
												<div><b>Type</b><span style={{ float: "right" }}>{state.mem.dimm}</span></div>
												<div><b>Usage</b><span style={{ float: "right" }}>{state.mem.used} / {state.mem.total}</span></div>
											</div>
										</Col>
										<Col sm={3}>
											<div style={{ height: 72, width: 72, margin: 16, float: "right" }} className="prog-purple">
												<CircularProgressbar value={state.mem.usage} maxValue={1} text={`${Math.floor(state.mem.usage * 100)}%`} />
											</div>
										</Col>
									</Row>
								</Card>
							</Col>

							<Col sm={12} md={6} lg={4} xl={3}>
								<Card>
									<CardTitle subtitle={`${state.storage.total} Hybrid`}>STORAGE</CardTitle>
									<hr/>
									<Row style={{ margin: 0 }}>
										<Col sm={9}>
											<div style={{ margin: 16 }}>
												<div><b>Used</b><span style={{ float: "right" }}>{state.storage.used}</span></div>
												<div><b>Total</b><span style={{ float: "right" }}>{state.storage.total}</span></div>
											</div>
										</Col>
										<Col sm={3}>
											<div style={{ height: 72, width: 72, margin: 16, float: "right" }} className="prog-green">
												<CircularProgressbar value={state.storage.usage} maxValue={1} text={`${Math.floor(state.storage.usage * 100)}%`} />
											</div>
										</Col>
									</Row>
								</Card>
							</Col>

							<Col sm={12} md={6} lg={4} xl={3}>
								<Card>
									<CardTitle subtitle="1 GBit/s Link">NETWORK</CardTitle>
									<hr/>
									<Row style={{ margin: 0 }}>
										<Col sm={9}>
											<div style={{ margin: 16 }}>
												<div><b>Ping</b><span style={{ float: "right" }}>{Math.floor(state.network.ping*10)/10} ms</span></div>
												<div><b>Download</b><span style={{ float: "right" }}>{state.network.recieve}</span></div>
												<div><b>Upload</b><span style={{ float: "right" }}>{state.network.send}</span></div>
											</div>
										</Col>
										<Col sm={3}>
											<div style={{ height: 72, width: 72, margin: 16, float: "right" }} className="prog-orange">
												<CircularProgressbar value={state.network.usage} maxValue={1} text={`${Math.floor(state.network.usage * 100)}%`} />
											</div>
										</Col>
									</Row>
								</Card>
							</Col>

						</Masonry>
					) : (
						<VHAlign>
							<center>
								<Spinner/>
								<br/><br/>
								{ state.error }
							</center>
						</VHAlign>
					) }

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/performance" }
