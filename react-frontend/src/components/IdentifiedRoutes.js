import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./Header";
import Footer from "./Footer";
import MainPage from "./MainPage";
import Login from "./user/Login";
import Logout from "./user/Logout";
import Contact from "./Contact";
import Dashboard from "./Dashboard";

// Contexts
import { UserContext } from "../contexts/UserContext";

/**
 * IdentifiedRoutes component renders the main application routes based on user authentication status.
 * 
 * It uses the UserContext to determine if a user is logged in and conditionally renders routes accordingly.
 * 
 * Routes:
 * - "/" renders the MainPage component.
 * - "/login" renders the Login component if the user is not logged in, otherwise redirects to the main page.
 * - "/logout" renders the Logout component.
 * - "/contact" renders the Contact component.
 * - "/dashboard" renders the Dashboard component if the user is logged in, otherwise redirects to the login page.
 * 
 * @component
 * @returns {JSX.Element} The IdentifiedRoutes component.
 */
function IdentifiedRoutes() {
	const { user } = useContext(UserContext);
	console.log(user);
	return (
		<div className="app-container">
			<Header />
			<div className="main-content">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route
						path="/login"
						element={user ? <Navigate to="/" /> : <Login />}
					/>
					<Route path="/logout" element={<Logout />} />

					<Route path="/contact" element={<Contact />} />

					<Route
						path="/dashboard"
						element={user ? <Dashboard /> : <Navigate to="/login" />}
					/>
				</Routes>
			</div>
			<Footer />
		</div>
	);
}

export default IdentifiedRoutes;
