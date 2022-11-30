import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MaterialIcons from "../MaterialIcons";
import "./header.css";
import "../Button/button.css";
import AppBox from "../AppBox/AppBox";
import GlobalContext from "../../context/GlobalContext";
import UserMenu from "../UserMenu/UserMenu";
import { userFallBackImg } from "../../utils/images";

export default function Header() {
	const {
		user,
		theme,
		toggleTheme,
		openSideBar,
		toggleSideBar,
		synchronize,
		isLoading
	} = useContext(GlobalContext);
	const vh = window.innerHeight / 100;
	const location = useLocation();
	const navigate = useNavigate();

	const [shadow, setShadow] = useState("none");

	const [height, setHeight] = useState(location.pathname === '/' ? 0 : "var(--head-height)");
	const [openAppBox, setOpenAppBox] = useState(false);

	const [openUserMenu, setOpenUserMenu] = useState(false);

	const [userPfp, setUserPfp] = useState(user?.avatar);

	useEffect(() => {
		document.addEventListener("scroll", () => {
			if (window.scrollY > 30 * vh) {
				setShadow("var(--shadow-elevation-2dp)");
				setHeight("var(--head-height)");
			} else {
				setShadow("none");
				setHeight("0");
			}
		});
		return () => {
			document.removeEventListener("scroll", () => {});
		};
	}, [vh]);

	useEffect(() => {
		setOpenAppBox(false);
		setOpenUserMenu(false);
	}, [location.pathname]);

	useEffect(() => {
		setUserPfp(user?.avatar);
	}, [user]);

	return (
		<header
			className="header"
			style={{
				boxShadow: shadow,
				borderBottomColor:
					shadow === "none"
						? "var(--back-shadow-light)"
						: "transparent",
				height:
					location.pathname === "/" && !openSideBar
						? height
						: "var(--head-height)",
				
			}}
		>
			<div className="header-left">
				<div className="header-left-burger">
					<button
						className="header-left-burger__button icon"
						onClick={toggleSideBar}
					>
						<MaterialIcons>
							{openSideBar ? "menu_open" : "menu"}
						</MaterialIcons>
					</button>
				</div>
				<Link to="/" className="header-left-logo">
					<img src="../../images/favicon.svg"/>
				</Link>
			</div>
			<div className="header-right">
				<button className="icon" title="Theme" onClick={toggleTheme}>
					<MaterialIcons>
						{theme === "light" ? "dark_mode" : "light_mode"}
					</MaterialIcons>
				</button>
				{isLoading ? (
					<div className="header-loader-spinner">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				) : (
					<button className="icon" title="Refresh" onClick={synchronize}>
						<MaterialIcons>sync</MaterialIcons>
					</button>
				)}
				<button className="icon" title="Settings" onClick={() => navigate("/settings")}>
					<MaterialIcons>settings</MaterialIcons>
				</button>
				<button
					className="icon"
					title="More"
					onClick={() => setOpenAppBox( e => !e )}
				>
					<MaterialIcons>apps</MaterialIcons>
				</button>
				{openAppBox && <AppBox close={() => setOpenAppBox(false)} />}
				<button className="icon" title="Profile" onClick={() => setOpenUserMenu(true)}>
					{user?.avatar ? (
						<img
							className="header-right-avatar"
							src={userPfp}
							alt={user.name}
							onError={() => {
								setUserPfp(userFallBackImg);
							}}
						/>
					) : (
						<MaterialIcons>account_circle</MaterialIcons>
					)}
				</button>
				{openUserMenu && (
					<UserMenu close={() => setOpenUserMenu(false)} />
				)}
			</div>
		</header>
	);
};
