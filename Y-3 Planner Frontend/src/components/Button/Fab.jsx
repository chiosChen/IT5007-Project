import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import MaterialIcons from "../MaterialIcons";
import "./button.css";

export default function Fab({ 
	onClick,
	icon,
	text = "", 
	className,
	size = "" 
}) {
	const { theme, accentColor } = useContext(GlobalContext);
	let classes = size === 'small' ? 'fab fab-sm': size === 'large' ? 'fab fab-lg' : 'fab';

	return (
		<button
			onClick={onClick}
			style={{
				backgroundColor: `var(--${accentColor}-${theme === "light" ? "100" : "700"})`,
			}}
			className={`${classes} ${className}`}
		>

			<MaterialIcons>{icon}</MaterialIcons>
			{text !== "" && <span>{text}</span>}

		</button>
	);
};


