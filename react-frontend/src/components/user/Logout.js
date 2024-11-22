import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import { Container } from "react-bootstrap";

// Contexts
import { UserContext } from "../../contexts/UserContext";

/**
 * Logout component that handles user logout process.
 *
 * @example
 * // Usage example:
 * <Logout  />
 *
 * @returns {JSX.Element} The rendered component.
 */
const Logout = () => {
	const { user, setUser } = useContext(UserContext);
	let navigate = useNavigate();
	useEffect(() => {
		if (user) {
			sessionStorage.removeItem("userToken");
			setUser(null);
		}
		//delay navigation to allow user context to update
		setTimeout(() => navigate("/"), 2000);
		navigate("/");
	}, [user]);

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh" }}
		>
			<h2>Logging out...</h2>
		</Container>
	);
};

export default Logout;
