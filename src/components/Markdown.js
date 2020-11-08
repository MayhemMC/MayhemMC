import React, { Fragment } from "react";
import Markdown from "react-markdown";

export default function Component({ source }) {
	const guid = Photon.guid();

	setTimeout(function(){
		//$("#" + guid).html(MinecraftText.toHTML($("#" + guid).html()//))
	})

	return (
		<div className="md-container" id={guid}>
			<Markdown escapeHtml={false} source={source}/>
		</div>
	)
}
