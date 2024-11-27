import React, { useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";

import { UserContext } from "../../contexts/UserContext";

const Error = ({ error }) => {
	const { user } = useContext(UserContext);

	if (user && user.role === "admin") {
		return (
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				<Card className="p-4">
					<Card.Body>
						<Card.Title>Error</Card.Title>
						<Card.Text>{error}</Card.Text>
						<Button href="/">Return to Home</Button>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<Card.Title>Error</Card.Title>
					<Card.Text>{error}</Card.Text>
					<Button href="/">Return to Home</Button>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Error;
