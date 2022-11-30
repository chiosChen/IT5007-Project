import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import "./button.css";

export default function Button({
	text = "Click",
	color,
	href = "#",
	target = "_blank",
	link,
	variant,
	className = "",
	size = "",
	icon = "",
	onClick,
	...rest
}) {
	const location = useLocation();
	const navigate = useNavigate();
	const { accentColor } = useContext(GlobalContext);
	let classes = "btn " + className;
	classes += color ? ` btn-${color}` : ` btn-${accentColor}`;
	classes += size === 'small' ? " btn-sm" : size === 'large' ? ' btn-lg' : '';
	if (variant === "fill" || variant === "outline")
		classes += ` btn-${variant}`;
	return (
		<button
			className={classes}
			{...rest}
			onClick={
				href !== "" && href !== "#"
					? () => window.open(href, target)
					: link !== location.pathname && link !== undefined
					? () => navigate(link)
					: onClick
			}
		>
			{icon !== "" && (
				<span className="material-symbols-outlined">{icon}</span>
			)}
			{text}
		</button>
	);
};


