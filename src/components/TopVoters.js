import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Player } from "components/PlayerList";

export default function Component() {

	const [ votes, _votes ] = useState([]);
	useEffect(() => votes.length === 0 && app.api("votes").then(({ votes: a }) => _votes(a)));

	return (
		<Card>
			<CardTitle>Top Voters ({["January","February","March","April","May","June","July","August","September","October","November","December"][new Date().getMonth()]})</CardTitle>
			<hr/>
			<List style={{ borderLeft: 0, borderRight: 0 }}>
				{ votes.map(({ last_name: name, votes }, key) =>
					<Player key={key} name={name} server={`${votes} Votes`}/>
				)}
			</List>
		</Card>
	)
}
