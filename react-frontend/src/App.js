import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Bootstrap CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import IdentifiedRoutes from "./components/IdentifiedRoutes";

// Contexts
import { UserProvider } from "./contexts/UserContext";

function App() {
	return (
		<UserProvider>
			<Router>
				<IdentifiedRoutes />
			</Router>
		</UserProvider>
	);
}

export default App;
