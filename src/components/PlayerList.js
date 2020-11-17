import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Indeterminate } from "@photoncss/Progress";
import MCText from "components/MCText";

export function Player({ name, server = null }) {

	// Initialize state
	const [ player, setState ] = useState(null);

	// State resolver
	const resolve = () => app.api("player", { name }).then(setState);

	// If player hasnt resolved yet
	if(player === null) {

		// Resolve state
		resolve();

		// Return placeholder component
		return (
			<ListItem waves={false}>
				<img src="https://crafatar.com/avatars/8667ba71-b85a-4004-af54-457a9734eed7" alt="" style={{ height: 36, width: 36, display: "inline-block", marginRight: 12, marginBottom: -20, borderRadius: 4, transform: "translateY(-9px)" }}/>
				<MCText style={{ display: "inline-block" }} delimiter="&">{name}</MCText>
				{ server !== null && <span style={{ position: "absolute", right: 16 }}>{server}</span>}
			</ListItem>
		)

	}

	return (
		<ListItem waves={false}>
			<img src={`https://crafatar.com/avatars/${player.uuid}?overlay=true`} alt="" style={{ height: 36, width: 36, display: "inline-block", marginRight :12, marginBottom: -20, borderRadius: 4, transform: "translateY(-9px)" }}/>
			<MCText style={{ display: "inline-block" }} delimiter="&">{`${player.prefix}${player.name}`}</MCText>
			{ server !== null && <span style={{ position: "absolute", right: 16 }}>{server}</span>}
		</ListItem>
	)
}

let initialRender = true;
export default function PlayerList({ only = false }) {

	// Initialize state
	const [ server, setState ] = useState(null);

	// State resolver
	const resolve = () => {
		initialRender = false;
		app.api("server").then(newState => {
			if(!Array.equals(server, newState)) setState(null);
			setState(newState);
		})
	}

	// Queue state to refresh every 5 seconds
	useEffect(function() {
		const interval = setInterval(resolve, 5000)
		return function() {
			clearInterval(interval);
		}
	})

	// If initial state isnt resolved
	if(server === null) {

		// Resolve state
		if(initialRender) resolve();

		// Return empty card with progress
		return (
			<Card>
				<CardTitle>Players</CardTitle>
				<Indeterminate/>
			</Card>
		);

	}

	// Map server's players to a array
	const online = [];
	const { servers } = server;
	(only !== false ? [ only ] : Object.keys(servers)).map(server => servers[server].players !== false && servers[server].players.map(name => online.push({ name, server })));

	// Return complete component
	return (
		<Card>
			<CardTitle>Players<span className="color-primary text-on-primary" style={{ fontSize: 14, borderRadius: 24, position: "absolute", height: 32, padding: "0 10px", right: 16 }}>{online.length}/{(only ? servers[only] : server).max_players}</span></CardTitle>
			{ online.length > 0 && <Fragment>
				<hr/>
				<List>
					{online.map(({ name, server }, key) => <Player name={name} server={only === false && server} key={key}/>)}
				</List>
			</Fragment>}
		</Card>
	)
}
