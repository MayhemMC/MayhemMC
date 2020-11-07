import React, { Fragment, useState, useEffect } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Spinner } from "@photoncss/Progress";

export default function Component() {
	const [ topVoters, setTopVoters ] = useState(false);
	const [ voteLinks, setVoteLinks ] = useState([]);

	let _mounted = false;
	useEffect(function() {
		_mounted = true;
		return function() {
			_mounted = false;
		}
	});

	setInterval(function() {
		_mounted && app.query().then(({ topVoters, voteLinks }) => {
			setTopVoters(topVoters);
			setVoteLinks(voteLinks);
		})
	}, 1000);

	return (
		<Fragment>
			<Card>
				<CardTitle>Vote</CardTitle>
				{ topVoters === false && <center style={{ padding: 36 }}>
					<Spinner/>
				</center> }
				{ topVoters !== false && <List style={{ borderBottom: "none", borderLeft: "none", borderRight: "none"}}>
					{ topVoters.map(({ last_name, votes }, key) => <ListItem waves={false} key={key} style={{ height: 56, position: "relative", paddingLeft: 8 }}>
						<img src={`https://minotar.net/bust/${last_name}/48`} alt="" style={{ position: "absolute", borderRadius: 4, margin: 4, width: 48, top: 0, left: 12 }}/>
						<span style={{ position: "absolute", fontSize: 16, fontFamily: "Roboto Mono", transform: "translateY(-12px)", left: 84 }}>{last_name}</span>
						<span style={{ opacity: .54, fontFamily: "Roboto Condensed", fontSize: 14, position: "absolute", right: 24, top: 18 }}>{votes} votes</span>
					</ListItem>) }
					</List>
				}
				<List style={{ borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
					{ voteLinks.map((link, key) => <a href={link} key={key} target="_blank"><ListItem leadingIcon="launch">Vote Link #{key + 1}</ListItem></a>)}
				</List>
			</Card>
		</Fragment>
	)
}
