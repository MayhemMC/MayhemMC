import React, { Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { DonationList } from "components/PlayerList";
import { Textfield } from "@photoncss/Textfield";

// Cache last name
let last_name = ""

// PlayerLogin component
export function PlayerLogin() {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Get unique id
	const guid = Photon.guid();

	// Make sure duplicate requests arent send
	useEffect(function() {
		const fetch = setInterval(async function() {

			// Get value
			const query = $(`#${guid}`).val();

			// Prevent duplicate searches
			if(query === last_name) return;

			// Lookup player
			const lookup = await app.api("player", { query });

			// If error
			if(lookup.success === false) return;

			// Get player
			const [ player ] = lookup.players;

			// Set state
			setState(player === undefined ? null : player);
			setStorePlayer(player === undefined ? null : player);
			last_name = query;

		}, 100);
		return () => clearInterval(fetch);
	})

	// Render component
	return (
		<div className="player-login" style={{ marginLeft: -8 }}>
			<Textfield variant="outlined" size="dense" label="Username" placeholder="Vacuro" id={guid}/>
			<div className="icon-wrapper" style={{ lineHeight: "74px", display: "inline-block", height: 74 }}>
				{ state === null && <div className="text-red"><Icon className="material-icons">error_outline</Icon><span style={{ transform: "translate(8px, -6px)", display: "inline-block" }}>Please use a valid username or uuid</span></div> }
				{ state !== null && state.has_joined === false && <div className="text-amber"><Icon className="material-icons">warning</Icon><span style={{ transform: "translate(8px, -6px)", display: "inline-block" }}>"{state.name}" has never joined before</span></div> }
				{ state !== null && state.updated === false && <div className="text-amber"><Icon className="material-icons">warning</Icon><span style={{ transform: "translate(8px, -6px)", display: "inline-block" }}>"{state.name}" has not joined recently</span></div> }
				{ state !== null && state.has_joined === true && state.updated === true && <div className="text-green"><Icon className="material-icons">check_circle_outlined</Icon><span style={{ transform: "translate(8px, -6px)", display: "inline-block" }}>Showing packages available for "{state.name}"</span></div> }
			</div>
		</div>
	);
}

// Packages component
export function Packages() {

	// Initialize state
	const [ state, setState ] = useState(null);
	global.setStorePlayer = player => setState(player);

	// If null state
	//if (state === null) return (
	//	<p>Please log in above to view packages</p>
	//)

	return (
		<div>
			{JSON.stringify(state)}
		</div>
	)

}

// Render view
function View() {

	return (
		<Fragment>

			<Toolbar color="primary" variant="raised" position="fixed">
				<Icon onClick={() => Photon.Drawer("#web-nav").open()}>menu</Icon>
				<ToolbarTitle subtitle="Mayhem MC">Web Store</ToolbarTitle>
			</Toolbar>
			<ToolbarSpacer/>

			<Container>
				<Row>

					<Col sm={12} lg={3}>
						<DonationList/>
					</Col>

					<Col sm={12} lg={9}>
						<div className="right-col-wrapper">

							<PlayerLogin/>
							<div className="title"><h2>Packages</h2></div>
							<Packages/>

						</div>
					</Col>

				</Row>
			</Container>
		</Fragment>
	)
}

// Export View and route
export default { View, route: "/store" }
