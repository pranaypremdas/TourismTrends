import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./Header";
import Footer from "./Footer";
import MainPage from "./MainPage";
import Login from "./user/Login";
import Logout from "./user/Logout";
import Profile from "./user/Profile";
import Contact from "./Contact/Contact";
import Dashboard from "./Dashboard";
import ManageUsers from "./admin/users/ManageUsers";
import ManageData from "./admin/data/ManageData";
import FirstUser from "./user/FirstUser";
import RenewSubscription from "./Contact/RenewSubscription";

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

	// If user is logged in and their subscription has expired, redirect to the RenewSubscription component
	if (user && user.client.expired) {
		return (
			<div className="app-container">
				<Header />
				<div className="main-content">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/logout" element={<Logout />} />
						{user && <Route path="/user/profile" element={<Profile />} />}

						<Route path="*" element={<RenewSubscription />} />
					</Routes>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="app-container">
			<Header />
			<div className="main-content">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/contact" element={<Contact />} />
					{!user && <Route path="/login" element={<Login />} />}
					{user && <Route path="/user/profile" element={<Profile />} />}

					{user && (user.role === "admin" || user.role === "client_admin") && (
						<>
							<Route path="/admin/users" element={<ManageUsers />} />
							{user.client.type !== "Government" && (
								<Route path="/admin/data" element={<ManageData />} />
							)}
						</>
					)}

					<Route
						path="/dashboard"
						element={user ? <Dashboard /> : <Navigate to="/login" />}
					/>
					{!user && <Route path="/first/user" element={<FirstUser />} />}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}

export default IdentifiedRoutes;
