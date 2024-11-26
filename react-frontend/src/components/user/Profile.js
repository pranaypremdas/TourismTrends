import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import { Container, Card, Button } from "react-bootstrap";

// Contexts
import { UserContext } from "../../contexts/UserContext";

const Profile = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.removeItem("userToken");
		setUser(null);
		navigate("/login");
	};

	return (
		<Container className="d-flex justify-content-center mt-4 mb-4">
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<h2 className="text-center mb-4">Profile</h2>
					{user && (
						<>
							<p>
								<strong>Email:</strong> {user.email}
							</p>
							<p>
								<strong>Role:</strong> {user.role}
							</p>
							<p>
								<strong>Client Name:</strong> {user.client_name}
							</p>
							<p>
								<strong>Client Type:</strong> {user.client_type}
							</p>
							<Button variant="danger" onClick={handleLogout} className="w-100">
								Logout
							</Button>
						</>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Profile;
