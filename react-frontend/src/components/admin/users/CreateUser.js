import React, { useState, useContext, useEffect } from "react";

// Bootstrap Components
import { Form, Button, Container, Alert, Card } from "react-bootstrap";

// Custom Components
import postRequest from "../../lib/postRequest";
import { UserContext } from "../../../contexts/UserContext";

const CreateUser = ({ clients, setUsers, maxUsers }) => {
	const { user } = useContext(UserContext);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		client_id: user.client_id,
		role: "user",
	});

	const [results, setResults] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const [response, error] = await postRequest("user/register", {
			...formData,
			client_id: user.role === "admin" ? formData.client_id : user.client_id,
		});

		if (error) {
			setError(error);
		} else {
			setResults(response.results);
			setUsers((s) => [
				...s,
				{
					id: response.results.id,
					client_id: response.results.client_id,
					client_name: clients.find((c) => c.id === response.results.client_id)
						.c_name,
					name: response.results.name,
					email: response.results.email,
					role: response.results.role,
					updated_at: response.results.updated_at,
					created_at: response.results.created_at,
				},
			]);
		}

		setLoading(false);
	};

	// check that the email domain matches the client domain
	useEffect(() => {
		if (formData.email && formData.email.includes("@")) {
			const foundClient = clients.find((c) => c.id === formData.client_id);
			const emailDomain = formData.email.split("@")[1];
			if (emailDomain !== foundClient.domain) {
				setMessage("Email domain does not match client domain");
			} else {
				setMessage(null);
			}
		}
	}, [formData.email, formData.client_id, clients, user]);

	return (
		<Container className="d-flex justify-content-center mt-4 mb-4">
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<Form onSubmit={handleRegister}>
						<Form.Group id="name" className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((s) => ({ ...s, name: e.target.value }))
								}
								required
								disabled={loading || maxUsers}
							/>
							<Form.Text className="text-muted">Required</Form.Text>
						</Form.Group>
						<Form.Group id="email" className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData((s) => ({ ...s, email: e.target.value }))
								}
								required
								disabled={loading || maxUsers}
							/>
							<Form.Text className="text-muted">
								Required. Email domain must match client domain
							</Form.Text>
						</Form.Group>

						<Form.Group id="role" className="mb-3">
							<Form.Label>Role</Form.Label>
							<Form.Select
								value={formData.role}
								onChange={(e) =>
									setFormData((s) => ({ ...s, role: e.target.value }))
								}
								disabled={loading || maxUsers}
							>
								<option value="user">User</option>
								<option value="client_admin">Client Admin</option>
								{user.role === "admin" && <option value="admin">Admin</option>}
							</Form.Select>
							<Form.Text className="text-muted">Required</Form.Text>
						</Form.Group>

						{user && user.role === "admin" && (
							<Form.Group id="client" className="mb-3">
								<Form.Label>Client</Form.Label>
								<Form.Select
									value={formData.client_id}
									onChange={(e) =>
										setFormData((s) => ({ ...s, client_id: e.target.value }))
									}
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

						<div className="d-flex justify-content-between mt-2">
							<Button
								variant="warning"
								type="reset"
								onClick={() => {
									setFormData({
										name: "",
										email: "",
										client_id: user.client_id,
										role: "user",
									});
									setError(null);
									setResults(null);
									setMessage(null);
								}}
							>
								Reset
							</Button>
							<Button
								variant="primary"
								type="submit"
								disabled={
									loading ||
									Boolean(message) ||
									Boolean(error) ||
									!Boolean(formData.name) ||
									!Boolean(formData.email) ||
									!Boolean(formData.client_id) ||
									Boolean(results) ||
									maxUsers
								}
							>
								{loading ? "Registering..." : "Register"}
							</Button>
						</div>
					</Form>
					{message && (
						<Alert variant="warning" className="mt-3">
							{message}
						</Alert>
					)}
					{error && (
						<Alert variant="danger" className="mt-3">
							{error}
						</Alert>
					)}
					{results && (
						<Alert variant="success" className="mt-3">
							Registration successful!
							<ul>
								<li>Name: {results.name}</li>
								<li>Email: {results.email}</li>
								<li>Password: {results.password}</li>
								<li>Role: {results.role}</li>
							</ul>
							Copy before clicking reset!
						</Alert>
					)}
					{maxUsers && (
						<Alert variant="warning" className="mt-3">
							You have reached the maximum number of users for this client.
						</Alert>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
};

export default CreateUser;
