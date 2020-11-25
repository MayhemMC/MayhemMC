import React, { Fragment } from "react";
import Markdown from "react-markdown/with-html";
import gfm from "remark-gfm"

export default function Component({ source }) {
	const guid = Photon.guid();

	setTimeout(function(){
		//$("#" + guid).html(MinecraftText.toHTML($("#" + guid).html()//))
	})

	return (
		<div className="md-container" id={guid}>
			<Markdown plugins={[ gfm ]} escapeHtml={false} source={source}/>
		</div>
	)
}
