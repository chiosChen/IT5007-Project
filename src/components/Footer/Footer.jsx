import React, { useContext, useState } from "react";
import LinkButton from '../Button/LinkButton'
import "./footer.css";
import GlobalContext from "../../context/GlobalContext";
import favicon, { waves } from "../../utils/images";

export default function Footer() {

	const { theme, accentColor } = useContext(GlobalContext);

	const r = 7;

	return (
		<footer
			className="footer"
			style={{
				backgroundImage: `url(${waves[accentColor][theme === "light" ? 0 : 1]})`
			}}
		>
			<div className="footer-top">
				<div className="footer-top-header">
					<LinkButton
						to="/about"
						children="About"
						color={accentColor}
					/>
				</div>
				<div className="footer-top-container">
					<div className="footer-top-body">
						<p>Privacy first, elegant and simple follow! Y^3 Planner is a web application built in MERN stack 
							to keep a track of your life and work.</p>
						<p>While using Y^3 Planner, you agree to have read and accepted 
							our terms of use, cookie and privacy policy.</p>
						<p>The current prototype is developed for the final project of IT5007
							by Y^3 Group at NUS</p>
					</div>
				</div>
			</div>
			<div className="footer-but">
				<div className="footer-but-container">
					<img
						className="footer-but-logo"
						src={favicon}
						alt="Y^3 Planner"
						style={{
							width: `${r + 1}rem`,
							height: `${r + 1}rem`
						}}
					/>
					<h2>Planner</h2>
				</div>
			</div>
			
			
		</footer>
	);
};

