import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

// Bootstrap CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import Login from "./components/user/Login";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";

// hooks
import useCheckUser from "./hooks/useCheckUser";

function App() {
	const [user, setUser] = useState(null);

	useCheckUser(setUser);

	return (
		<Router>
			<div className="app-container">
				<Header user={user} />
				<div className="main-content">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route
							path="/login"
							element={user ? <Navigate to="/dashboard" /> : <Login />}
						/>
						<Route path="/contact" element={<Contact />} />
						<Route
							path="/dashboard"
							element={
								user ? <Dashboard user={user} /> : <Navigate to="/login" />
							}
						/>
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
