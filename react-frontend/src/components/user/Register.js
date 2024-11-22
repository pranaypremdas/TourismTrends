import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import postRequest from "./postRequest"; // Adjust the import path as necessary

const RegisterUser = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [results, setResults] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const [data, error] = await postRequest("user/register", {
			email,
			password,
		});

		if (error) {
			setError(error);
		} else {
			setResults(data);
		}

		setLoading(false);
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh" }}
		>
			<div style={{ width: "100%", maxWidth: "400px" }}>
				<h2 className="text-center mb-4">Register</h2>
				<Form onSubmit={handleRegister}>
					<Form.Group id="email" className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group id="password" className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Group>
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
			</div>
		</Container>
	);
};

export default RegisterUser;
