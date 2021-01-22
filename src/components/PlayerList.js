import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Indeterminate } from "@photoncss/Progress";
import MCText from "components/MCText";
import ordinal from "ordinal";

/* Player Component
 *
 * displays the player with
 * their name and in game
 * prefix along with their
 * skin and server if applicable
 */
export function Player({ prefix, alt = null, name, uuid }) {
	return (
		<ListItem waves={false}>
			<img src={`https://crafatar.com/avatars/${uuid || "000000000000000000000000000000000"}?default=MHF_Steve&overlay`} alt="" style={{ height: 36, width: 36, display: "inline-block", marginRight :12, marginBottom: -20, borderRadius: 4, transform: "translateY(-9px)" }}/>
			<MCText style={{ display: "inline-block", verticalAlign: "text-bottom" }} delimiter="&">{`${prefix}${name}`}</MCText>
			{ alt !== null && <span className="alt-text">{alt}</span>}
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
		data.players = (data.players || []).map(player => ({
			...player,
			alt: list.players.filter(a => a.player === player.name)[0].server
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
			{ state.players.length > 0 && <Fragment>
				<hr/>
				<List>
					{ state.players.map((player, key) => <Player key={key} {...player}/>)}
				</List>
			</Fragment>}
		</Card>
	);

}

/* Vote List Component
 *
 * List players and the
 * the number of times
 * they voted this month
 */
export function VoteList() {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Function to set players
	async function fetch() {

		// Fetch voter list
		const list = await app.api("votes");

		// Convert votes to list
		let query = [];
		list.votes.map(({ name }) => query.push(name));
		query = query.join(",");

		// Fetch player data
		const data = await app.api("player", { query });
		data.players = data.players.map(player => ({
			...player,
			alt: `${ordinal(player.votes.place)} place • ${player.votes.amount} votes`
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
			<CardTitle>Top Voters</CardTitle>
			<Indeterminate/>
		</Card>
	)

	// Return component
	return (
		<Card>
			<CardTitle>
				<span>Top Voters</span>
				<span className="color-primary text-on-primary" style={{
				  fontSize: 14,
				  borderRadius: 24,
				  position: "absolute",
				  height: 32,
				  padding: "0 10px",
				  right: 16
			  }}>{state.numvoters} players • {state.numvotes} votes</span>
			</CardTitle>
			{ state.players.length > 0 && <Fragment>
				<hr/>
				<List>
					{ state.players.map((player, key) => <Player key={key} {...player}/>)}
				</List>
			</Fragment>}
		</Card>
	);

}

/* Donation List Component
 *
 * List players that most
 * recently donated
 */
export function DonationList() {

	// Initialize state
	const [ state, setState ] = useState(null);

	// Function to set players
	async function fetch() {

		// Fetch voter list
		const list = await app.api("donations");

		// Convert votes to list
		let query = [];
		list.donations.map(({ name }) => query.push(name));
		query = query.join(",");

		// Fetch player data
		const data = await app.api("player", { query });

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
			<CardTitle>Recent Donators</CardTitle>
			<Indeterminate/>
		</Card>
	)

	// Return component
	return (
		<Card>
			<CardTitle>
				<span>Recent Donators</span>
			</CardTitle>
			{ state.players.length > 0 && <Fragment>
				<hr/>
				<List>
					{ state.players.map((player, key) => <Player key={key} {...player}/>)}
				</List>
			</Fragment>}
		</Card>
	);

}
