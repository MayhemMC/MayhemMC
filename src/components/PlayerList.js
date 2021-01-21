import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Indeterminate } from "@photoncss/Progress";
import MCText from "components/MCText";

/* Player Component
 *
 * displays the player with
 * their name and in game
 * prefix along with their
 * skin and server if applicable
 */
export function Player({ prefix, server = null, name, uuid }) {
	return (
		<ListItem waves={false}>
			<img src={`https://crafatar.com/avatars/${uuid || "000000000000000000000000000000000"}?default=MHF_Steve&overlay`} alt="" style={{ height: 36, width: 36, display: "inline-block", marginRight :12, marginBottom: -20, borderRadius: 4, transform: "translateY(-9px)" }}/>
			<MCText style={{ display: "inline-block" }} delimiter="&">{`${prefix}${name}`}</MCText>
			{ server !== null && <span style={{ position: "absolute", right: 16 }}>{server}</span>}
		</ListItem>
	)
}

/* Global List Component
 *
 * List players and the
 * server they are currently
 * playing on
 */
export function GlobalList() {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Function to set players
	async function fetch() {

		// Fetch player list
		const list = await app.api("list");

		// Convert online players to list
		let query = [];
		list.players.map(({ player }) => query.push(player));
		query = query.join(",");

		// Fetch player data
		const data = await app.api("player", { query });
		data.players = data.players.map(player => ({
			...player,
			server: list.players.filter(a => a.player === player.name)[0].server
		}));

		// Set state
		setState({ ...list, ...data });

	}

	// Have state sync with server every second while component is mounted
	useEffect(function() {
		const sync = setInterval(fetch, 1000);
		return () => clearInterval(sync);
	});

	// Return default card if its loading
	if (state === null) return (
		<Card>
			<CardTitle>Players</CardTitle>
			<Indeterminate/>
		</Card>
	)

	// Return component
	return (
		<Card>
			<CardTitle>
				<span>Players</span>
				<span className="color-primary text-on-primary" style={{
				  fontSize: 14,
				  borderRadius: 24,
				  position: "absolute",
				  height: 32,
				  padding: "0 10px",
				  right: 16
			  }}>{state.online}/{state.limit}</span>
			</CardTitle>
			{ state.online > 0 && <Fragment>
				<hr/>
				<List>
					{ state.players.map((player, key) => <Player key={key} {...player}/>)}
				</List>
			</Fragment>}
		</Card>
	);

}
