import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";
import { Row, Col } from "../../layout/Responsive";
import MaterialIcons from "../MaterialIcons";
import "./user-menu.css";

export default function UserMenu({ close }) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const loggedOut = [
		{
			title: "Sign In",
			link: "/login",
			icon: "login",
		},
		{
			title: "Sign Up",
			link: "/register",
			icon: "account_circle",
		},
	];
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const loggedIn = [
		{
			title: "My profile",
			link: "/profile",
			icon: "face",
		},
		{
			title: "Log Out",
			link: "/logout",
			icon: "logout",
		},
	];
	const { isAuthenticated } = useContext(GlobalContext);

	const [userLinks, setUserLinks] = useState(isAuthenticated ? loggedIn : loggedOut);

	useEffect(() => {
		setUserLinks(isAuthenticated ? loggedIn : loggedOut);
	}, [isAuthenticated, loggedIn, loggedOut]);

	return (
		<section className="user-menu">
			<div className="user-menu-cover" onClick={close}></div>
			<div className="user-menu-container">
				<Row>
					{userLinks.map((link, id) => (
						<Col lg={50} md={50} sm={50} key={id}>
							<Link to={link.link} className="user-menu-link">
								<MaterialIcons>{link.icon}</MaterialIcons>
								<span>{link.title}</span>
							</Link>
						</Col>
					))}
				</Row>
			</div>
		</section>
	);
};

