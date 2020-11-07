import React, { Fragment, useState, useEffect } from "react";
import { Card } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Spinner } from "@photoncss/Progress";

export default function Component() {

	const [ players, setPlayers ] = useState(false);
	const [ uniqueJoins, setUniqueJoins ] = useState(0);

	let _mounted = false;
	useEffect(function() {
		_mounted = true;
		return function() {
			_mounted = false;
		}
	});

	setInterval(function() {
		_mounted && app.query().then(({ players, uniqueJoins }) => {
			setPlayers(players)
			setUniqueJoins(uniqueJoins)
		})
	}, 1000);

	return (
		<Fragment>
			<Card style={{ overflow: "hidden" }}>
				{ players === false && <center style={{ padding: 36 }}>
					<Spinner/>
				</center> }
				{ players !== false && <center style={{ paddingTop: 36 }}>
					<h3 style={{ fontWeight: 300 }}>{players.length} Online</h3>
					<h6 style={{ fontWeight: 300, marginBottom: 36 }}>{uniqueJoins.toLocaleString(navigator.language)} players all time</h6>
				</center> }
				{ players !== false && players.length !== 0 && <List style={{ borderBottom: "none", borderLeft: "none", borderRight: "none", maxHeight: 512, overflowY: "auto" }}>
					{ players.map(({ name, location }, key) => <ListItem waves={false} key={key} style={{ height: 56, position: "relative", paddingLeft: 8 }}>
						<img src={`https://minotar.net/bust/${name}/48`} alt="" style={{ position: "absolute", borderRadius: 4, margin: 4, width: 48, top: 0, left: 12 }}/>
						<span style={{ position: "absolute", fontSize: 16, fontFamily: "Roboto Mono", transform: "translateY(-12px)", left: 84 }}>{name}</span>
						<span style={{ opacity: .54, fontFamily: "Roboto Condensed", fontSize: 14, position: "absolute", right: 24, top: 18 }}>{location}</span>
					</ListItem>) }
				</List>
				}
			</Card>
		</Fragment>
	)
}
