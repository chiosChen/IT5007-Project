import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import "./settings.css";
import MaterialIcons from "../../components/MaterialIcons";
import { useNavigate } from "react-router-dom";

export default function Settings() {
	const colors = [
		"indigo",
		"blue",
		"red",
		"green",
		"pink",
		"brown",
		"orange",
	];
	const { accentColor, updateAccentColor } = useContext(GlobalContext);
	const navigate = useNavigate();
	return (
		<main className="settings">
			<div className="settings-left">
				<section className="settings-head">
					<h1>Settings</h1>
				</section>
				<section className="settings-body">
					<div className="settings-body-theme">
						<h3>Theme</h3>
						<div className="settings-body-theme-colors">
							{colors.map((color, id) => (
								<button
									key={id}
									style={{
										backgroundColor: `var(--${color})`,
										outline: `6px solid var(--${
											accentColor === color
												? color + "-100"
												: "transparent"
										})`,
									}}
									onClick={(e) => {
										e?.preventDefault();
										updateAccentColor(color);
									}}
								></button>
							))}
						</div>
					</div>
				</section>
			</div>
			<div className="settings-right">
				<button className="icon" onClick={() => navigate("/")}>
						<MaterialIcons>close</MaterialIcons>
				</button>
			</div>
		</main>
	);
};

