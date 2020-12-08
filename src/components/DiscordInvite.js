import React, { useState, useEffect } from "react";
import nodeFetch from "node-fetch";
import "./DiscordInvite.less";

export default function({ palette = "dark", inviteCode = "YPmMwGQ" }) {

    const [ state, setState ] = useState({
		stateSet: false,
        serverIcon: "https://steamuserimages-a.akamaihd.net/ugc/961973556167374789/672A76928C54C3E57E081E0EB9E9A752B18B1778/",
		serverName: "Loading...",
		memberCount: ["∅", "∅"]
    });

	useEffect(function() {
		nodeFetch(`//discord.com/api/invites/${inviteCode}`)
		  .then(r => r.json())
		  .then(({ guild }) => {
		    state.stateSet === false &&
		        setState({
		            stateSet: true,
		            serverIcon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`,
		            serverName: guild.name,
		            memberCount: ["∅", "∅"]
		        });
		});
	})

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
				<a className="DiscordInvite-joinLink" href={`//discord.gg/${inviteCode}`}>Join</a>
	        </div>
	    </div>
	);

}
