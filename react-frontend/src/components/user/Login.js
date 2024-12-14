import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

// Contexts
import { UserContext } from "../../contexts/UserContext";

// Custom Components
import handleLogin from "./handleLogin";
import testEmail from "../lib/testEmail";

const Login = () => {
	let navigate = useNavigate();
	const { setUser } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email && !password) {
			setFormError(null);
		} else if (email && !testEmail(email)) {
			setFormError("Please enter a valid email address");
		} else if (!email || !password) {
			setFormError("Please fill in all fields");
		} else {
			setFormError("");
		}
	}, [email, password]);

	const onLogin = (e) => {
		e.preventDefault();
		handleLogin(email, password, setLoading, setFormError, setUser, navigate);
	};

	return (
		<Container className="d-flex justify-content-center mt-4 mb-4">
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<h2 className="text-center mb-4">Please Login</h2>

					<Form onSubmit={(e) => onLogin(e)}>
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
						{formError && <Alert variant="warning">{formError}</Alert>}
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
