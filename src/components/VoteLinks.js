import React, { Fragment, useEffect, useState } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";

export default function Component() {

	const [ links, _links ] = useState([]);
	useEffect(() => links.length === 0 && app.api("votes").then(({ links: a }) => _links(a)));

	return (
		<Card>
			<CardTitle>Vote Links</CardTitle>
			<hr/>
			<List style={{ borderLeft: 0, borderRight: 0 }}>
				{ links.map((link, key) =>
					<a href={link} target="_blank">
						<ListItem leadingIcon="link" key={key}>Vote Link #{key+1}</ListItem>
					</a>
				)}
			</List>
		</Card>
	)
}
