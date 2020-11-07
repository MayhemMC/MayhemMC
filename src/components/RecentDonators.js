import React, { Fragment, useState, useEffect } from "react";
import { Card, CardTitle } from "@photoncss/Card";
import { List, ListItem } from "@photoncss/List";
import { Spinner } from "@photoncss/Progress";

function imgFromName(name, { packages }) {
	for (let pkg of packages) if(pkg.name === name) return pkg;
}

export default function Component() {
	const [ store, setStore ] = useState(false);

	let _mounted = false;
	useEffect(function() {
		_mounted = true;
		return function() {
			_mounted = false;
		}
	});

	setInterval(function() {
		_mounted && app.query().then(({ store }) => setStore(store))
	}, 1000);

	return (
		<Fragment>
			<Card>
				<CardTitle>Recent Donations</CardTitle>
				{ store === false && <center style={{ padding: 36 }}>
					<Spinner/>
				</center> }
				{ store !== false && <List style={{ borderBottom: "none", borderLeft: "none", borderRight: "none"}}>
					{ store.donators.map((item, key) => <ListItem waves={false} key={key} style={{ height: 56, position: "relative", paddingLeft: 8 }}>
						<img src={`https://minotar.net/bust/${item.name}/48`} alt="" style={{ position: "absolute", borderRadius: 4, margin: 4, width: 48, top: 0, left: 12 }}/>
						<span style={{ position: "absolute", fontSize: 16, fontFamily: "Roboto Mono", transform: "translateY(-12px)", left: 84 }}>{item.name}</span>
						<img src={imgFromName(item.package, store).imageUrl} alt="" style={{ position: "absolute", borderRadius: 4, margin: 4, width: 48, top: 0, right: 12 }}/>
					</ListItem>) }
					</List>
				}
			</Card>
		</Fragment>
	)
}
