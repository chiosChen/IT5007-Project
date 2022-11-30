import React from "react";
import { Link } from "react-router-dom";
import "./button.css";

export default function LinkButton({ to, children, ...rest }) {
	return (
		<Link className="link-button" to={to} style={{...rest}}>
			{children}
		</Link>
	);
};


