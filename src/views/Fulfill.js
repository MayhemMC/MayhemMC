import React, { useState, useEffect } from "react";
import { VHAlign } from "@photoncss/Layout";
import { Icon } from "@photoncss/Icon";
import { parse as qsparse } from "qs";

// Render view
function View() {

	// initialize state
	const [ state, setState ] = useState(null);

	// Get order id
	const { order } = qsparse(location.search.substr(1));

	// On component mount
	useEffect(function() {

		// Fetch state from server
		if(state === null) app.api("checkout/fulfill", { order }).then(setState);

	});

	// If null state
	if(state === null) return null;

	// If bad state
	if(state.success === false && (state.error === "Invalid order" || state.error === "Not paid")) {
		return (
			<VHAlign>
				<center>
					<Icon style={{ fontSize: 96, width: "auto" }} className="material-icons text-red">error_outline</Icon>
					<p>{state.error}</p>
				</center>
			</VHAlign>
		)
	}

	// Return animation
	return (
		<VHAlign>
			<center>
				<Icon style={{ fontSize: 96, width: "auto" }} className="material-icons green-red">check_circle_outline</Icon>
				<p>Thank you for supporting Mayhem MC!</p>
			</center>
		</VHAlign>
	)
}

// Export View and route
export default { View, route: "/store/fulfill" }
