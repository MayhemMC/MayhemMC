import React, { Fragment, useState, useEffect } from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import { Container, Row, Col } from "@photoncss/Layout";
import { Toolbar, ToolbarTitle, ToolbarSpacer } from "@photoncss/Toolbar";
import { Icon } from "@photoncss/Icon";
import { DonationList } from "components/PlayerList";
import { Textfield } from "@photoncss/Textfield";
import Markdown from "components/Markdown";
import MCText from "components/MCText";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Menu } from "@photoncss/Menu";
import classnames from "classnames";
import { Spinner } from "@photoncss/Progress";

// Cache last name
let last_name = "";

// Cache store player
let store_player = null;

// PlayerLogin component
export function PlayerLogin() {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Get unique id
	const guid = Photon.guid();

	// Make sure duplicate requests arent send
	useEffect(function() {
		let pull_active = true;
		(async function fetch() {

			// Get value
			const query = $(`#${guid}`).val().toLowerCase();

			// Prevent duplicate searches
			if(query === last_name) return setTimeout(fetch);
			last_name = query;

			// If empty field
			if(query === "") {
				setState(null);
				setStorePlayer(null);
				return setTimeout(fetch);
			}


			// Lookup player
			const lookup = await app.api("player", { query });

			// If still pulling, fetch again in 10ms
			if(pull_active) setTimeout(fetch)

			// If error
			if(lookup.success === false) return;

			// Get player
			const [ player ] = lookup.players;

			// Set state
			setState(player === undefined ? null : player);
			setStorePlayer(player === undefined ? null : player);

		}());
		return () => { pull_active = false };
	})

	// Render component
	return (
		<div className="player-login" style={{ marginLeft: -8, marginBottom: -8 }}>
			<Textfield variant="outlined" size="dense" label="Username or UUID" placeholder="Vacuro" id={guid} />
			<div className="icon-wrapper" style={{ lineHeight: "74px", display: "inline-block" }}>
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
	global.setStorePlayer = player => {
		store_player = player;
		setState(player);
	}

	// Render component
	return <PackageList buyer={state}/>

}

// PackageList component
export function PackageList({ buyer }) {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Fetch latest state from server
	const fetch = async function() {
		if(state !== null) return;
		const store = await app.api("store");
		setState(store);
	}

	// Have state sync with server every second while component is mounted
	useEffect(function() {
		fetch();
	});

	// If null state
	if(state === null) return null;

	// Get packages from state
	let { packages } = state;

	// Render component
	return (
		<div className="package-list">
			<Card>
				<CardTitle>Packages</CardTitle>
				<List style={{ border: "none" }}>
					{ packages.map(rank => <Package rank={rank} player={buyer} packages={packages} key={rank.tier}/>) }
				</List>
			</Card>
		</div>
	);

}

// Package component
export function Package({ rank, player, packages }) {

	// Get index of rank
	const index = player !== null && player.hasOwnProperty("donator") && player.donator !== null ? packages.indexOf(packages.filter(({ name }) => name === player.donator.package.toLowerCase())[0]) : -1;

	// Get is player baught this package before
	const baught = index >= rank.tier - 1;

	// Get price
	const price = player !== null && player.hasOwnProperty("donator") && player.donator !== null ? (rank.price - (player.donator === null ? 0 : packages.filter(({ name }) => name.toLowerCase() === player.donator.package.toLowerCase())[0].price)) : rank.price;

	// Generate menu guid
	const guid = Photon.guid();

	// Reload photon on render
	requestAnimationFrame(Photon.reload);

	// Show details popup
	async function details() {
		const dialog = new Photon.Dialog({
			type: "alert",
			transition: "grow",
			title: renderToString(<MCText delimiter="&">{rank.prefix}</MCText>),
			content: renderToString(<div style={{ maxHeight: "calc(100vh - 16px - 126px)", overflowY: "auto", marginTop: -28, borderTop: "1px solid #292b2f", borderBottom: "1px solid #292b2f" }}><Markdown source={rank.features}/></div>),
			actions: [{
				name: "Purchase",
				click() {
					dialog.close();
					purchase();
				}
			}, {
				name: "Close",
				click() {
					dialog.close()
				}
			}]
		}).open();
	}

	// Purchase
	async function purchase() {

		// Get player
		const player = store_player;

		// Make sure a player is logged in
		if(player === null) return Photon.Snackbar({ duration: 7500, classes: "red", content: `Please use a valid username or uuid` })

		// Open dialog
		new Photon.Dialog({
			type: "alert",
			transition: "grow",
			dismissable: false,
			content: `<div id="purchase-root"></div>`
		}).open();

		// Render checkout to dialog
		render(<Checkout player={player} rank={rank} price={price}/>, $("#purchase-root").parent()[0]);

	}

	// Render component
	return (
		<Fragment>
			<li className={classnames("list-item package", { baught })}>
				<img src={rank.iconURL} alt="" style={{ height: "calc(100% - 22px)", width: "auto", margin: 8 }}/>
				<MCText delimiter="&" style={{ width: 112, display: "inline-block" }}>{rank.prefix}</MCText>
				<span className="price">{baught ? "" : Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)}</span>
				<div className="meta">
					<Icon style={{ width: 48, height: 48, lineHeight: "48px", color: "#dcddde" }} id={guid + "icon"}onClick={ () => Photon.Menu(`#${guid}`).anchor(`#${guid}icon`).open() }>more_vert</Icon>
				</div>
			</li>
			<Menu id={guid}>
				<ListItem leadingIcon="info_outlined" onClick={details}>Package Details</ListItem>
				<ListItem leadingIcon="add_shopping_cart" onClick={ () => purchase()}>Purchase</ListItem>
			</Menu>
		</Fragment>
	);

}

// Checkout Dialog Component
export function Checkout({ player, rank }) {

	// Initialize state
	const [ state, setState ] = useState(null);

	// If loading
	if(state === null) return (
		<center style={{ padding: 64 }}>
			<Spinner/>
		</center>
	);
	
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

							<div className="title"><h2>Log In</h2></div>
							<PlayerLogin/>
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
