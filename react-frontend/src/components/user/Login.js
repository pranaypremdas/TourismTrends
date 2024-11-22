import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

import postRequest from "../lib/postRequest";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email && !password) {
			setFormError(null);
		} else if (!email || !password) {
			setFormError("Please fill in all fields");
		} else {
			setFormError("");
		}
	}, [email, password]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setFormError(null);

		const [data, error] = await postRequest("user/login", {
			email,
			password,
		});

		if (error) {
			setFormError(error);
		} else {
			// data gets saved to local session storage
			if (data && data.token) {
				sessionStorage.setItem("userToken", data);
			}
		}

		setLoading(false);
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "100vh" }}
		>
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<h2 className="text-center mb-4">Login</h2>
					{formError && <Alert variant="danger">{formError}</Alert>}
					<Form onSubmit={handleLogin}>
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
							Login
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Login;
