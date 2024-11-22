import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Bootstrap CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import Login from "./components/user/Login";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";

function App() {
	return (
		<Router>
			<div className="app-container">
				<Header />
				<div className="main-content">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/login" element={<Login />} />
						{"/login"}
						<Route path="/contact" element={<Contact />} />
						{"/contact"}
						<Route path="/dashboard" element={<Dashboard />} />
						{"/dashboard"}
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
