import React, { Fragment } from "react";
import Markdown from "react-markdown";
//import MinecraftText from "minecraft-text-js";

import { Card } from "@photoncss/Card";

export default function Component({ source }) {
	const guid = Photon.guid();

	setTimeout(function(){
		//$("#" + guid).html(MinecraftText.toHTML($("#" + guid).html()//))
	})

	return (
		<div className="md-container" id={guid}>
			<Markdown escapeHtml={false} source={ require(`../../docs/${source}.md`).default }/>
		</div>
	)
}
