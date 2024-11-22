import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import { Container } from "react-bootstrap";

/**
 * Logout component that handles user logout process.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.user - The current user object.
 *
 * @example
 * // Usage example:
 * <Logout user={currentUser} />
 *
 * @returns {JSX.Element} The rendered component.
 */
const Logout = ({ user }) => {
	let navigate = useNavigate();
	useEffect(() => {
		if (user) {
			sessionStorage.removeItem("userToken");
		}
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
