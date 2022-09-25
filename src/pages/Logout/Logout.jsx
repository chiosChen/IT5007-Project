import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import GlobalContext from "../../context/GlobalContext";

export default function Logout() {
	const { setIsAuthenticated, setUser, setSnackMsg, setShowSnackBar, setIsLoading } = useContext(GlobalContext);
	useEffect(() => {
		setIsLoading(true);
		setIsAuthenticated(false);
		setUser(null);
		localStorage.setItem("isAuthenticated", false);
		localStorage.setItem("user", null);
		localStorage.setItem("token", null);
		setSnackMsg({
			text: "You have been logged out",
			bgColor: "var(--yellow)",
			color: "var(--black)"
		});
		setShowSnackBar(true);
		setTimeout(() => {
			setShowSnackBar(false);
		}, 3000);
		setIsLoading(false);
	}, [setIsAuthenticated, setShowSnackBar, setSnackMsg, setUser]);

	return <Navigate to={"/"} />;
};

