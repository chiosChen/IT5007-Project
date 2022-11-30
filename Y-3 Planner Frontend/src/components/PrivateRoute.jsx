import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";


export default function PrivateRoute({ children }) {
	const { isAuthenticated } = useContext(GlobalContext);
	return isAuthenticated ? children : <Navigate to='/login' />;
}





