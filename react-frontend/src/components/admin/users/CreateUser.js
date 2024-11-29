import React, { useState, useContext } from "react";

// Bootstrap Components
import { Form, Button, Container, Alert, Card } from "react-bootstrap";

// Custom Components
import postRequest from "../../lib/postRequest";
import { UserContext } from "../../../contexts/UserContext";

const CreateUser = ({ clients }) => {
	const { user } = useContext(UserContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [results, setResults] = useState(null);
	const [client, setClient] = useState(user ? user.client_id : null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const [data, error] = await postRequest("user/register", {
			name,
			email,
			client_id: user.role === "admin" ? client : user.client_id,
		});

		if (error) {
			setError(error);
		} else {
			setResults(data);
		}

		setLoading(false);
	};

	return (
		<Container className="d-flex justify-content-center mt-4 mb-4">
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<Form onSubmit={handleRegister}>
						<Form.Group id="name" className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="email" className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Form.Group>
						{user && user.role === "admin" && (
							<Form.Group id="client" className="mb-3">
								<Form.Label>Client</Form.Label>
								<Form.Select
									value={client}
									onChange={(e) => setClient(e.target.value)}
								>
									<option value={null}>Select a client</option>
									{clients &&
										clients.map((client) => (
											<option key={client.id} value={client.id}>
												{client.c_name}
											</option>
										))}
								</Form.Select>
							</Form.Group>
						)}
						<Button type="submit" className="w-100" disabled={loading}>
							{loading ? "Registering..." : "Register"}
						</Button>
					</Form>
					{error && (
						<Alert variant="danger" className="mt-3">
							{error}
						</Alert>
					)}
					{results && (
						<Alert variant="success" className="mt-3">
							Registration successful!
						</Alert>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
};

export default CreateUser;
