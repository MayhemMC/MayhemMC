import React, { useState, useEffect } from "react";
import "./DiscordInvite.less";

export default function({ palette = "dark", inviteCode }) {

	// Initialize state
    const [ state, setState ] = useState({
        serverIcon: "https://steamuserimages-a.akamaihd.net/ugc/961973556167374789/672A76928C54C3E57E081E0EB9E9A752B18B1778/",
		serverName: "Loading...",
		memberCount: ["∅", "∅"]
    });

	// Function to set players
	async function fetch() {

		// Fetch player list
		const newState = await app.api("discord");

		// Set state
		setState(newState);

	}

	// Have state sync with server every second while component is mounted
	useEffect(function() {
		const sync = setInterval(fetch, 1000);
		return () => clearInterval(sync);
	});

    return (
		<div className={`DiscordInvite-root palette-${palette}`}>
	        <h5 className="DiscordInvite-title">
	            You received an invite to a server
	        </h5>
	        <div className="DiscordInvite-body">
	            <div className="DiscordInvite-serverIcon" style={{ backgroundImage: `url(${state.serverIcon})` }}/>
	            <div className="DiscordInvite-content">
	                <h3 className="DiscordInvite-serverName">{state.serverName}</h3>
	                <strong className="DiscordInvite-memberCount">
	                    <span>{state.memberCount[0]} Online</span>
	                    <span>{state.memberCount[1]} Members</span>
	                </strong>
	            </div>
				<a className="DiscordInvite-joinLink" href="//discord.gg/4FBnfPA">Join</a>
	        </div>
	    </div>
	);

}
