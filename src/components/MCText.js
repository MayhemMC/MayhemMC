import React, { Fragment } from "react";
import { render } from "minecraft-text";
import "minecraft-text/style.css";


export default function Component({ children, delimiter, style }) {
	return <div style={style} dangerouslySetInnerHTML={{ __html: render(children, delimiter) }} />
}
