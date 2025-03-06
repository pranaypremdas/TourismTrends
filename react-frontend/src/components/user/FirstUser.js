import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

// Contexts
import { UserContext } from "../../contexts/UserContext";

// Custom Components
import postRequest from "../lib/postRequest";
import Loading from "../Loading";
import handleLogin from "./handleLogin";
import testEmail from "../lib/testEmail";

const FirstUser = () => {
	let navigate = useNavigate();
	const { setUser } = useContext(UserContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [formError, setFormError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [firstUser, setFirstUser] = useState(null);

	useEffect(() => {
		if (!email && !name) {
			setFormError(null);
		} else if (email && !testEmail(email)) {
			setFormError("Please enter a valid email address");
		} else if (!email || !name) {
			setFormError("Please fill in all fields");
		} else {
			setFormError("");
		}
	}, [email, name]);

	// Check if first user exists already
	useEffect(() => {
		const checkFirstUser = async () => {
			setLoading(true);
			const [data, error] = await postRequest(
				"user/first",
				{
					checkFirstUser: true,
				},
				false
			);

			if (error) {
				navigate("/login");
			} else {
				if (data && data.actionFirstUser) {
					setShowForm(true);
				}
			}
			setLoading(false);
		};
		checkFirstUser();
	}, [navigate]);

	// Create first user
	const handleCreateFirstUser = async (e) => {
		e.preventDefault();
		setLoading(true);
		setFormError(null);

		const [data, error] = await postRequest(
			"user/first",
			{
				email,
				name,
			},
			false
		);

		if (error) {
			setFormError(error);
		} else {
			// data gets saved to local session storage
			if (data) {
				setShowForm(false);
				setFirstUser(data.results);
			}
		}

		setLoading(false);
	};

	// Login with first user
	const onLogin = (e) => {
		e.preventDefault();
		handleLogin(
			firstUser.email,
			firstUser.password,
			setLoading,
			setFormError,
			setUser,
			navigate
		);
	};

	if (loading) {
		return <Loading />;
	}

	if (firstUser) {
		return (
			<Container className="d-flex justify-content-center mt-4 mb-4">
				<Card style={{ width: "100%", maxWidth: "400px" }}>
					<Card.Body>
						<h2 className="text-center mb-4">Admin Created</h2>

						<p>
							<strong>Email:</strong> {firstUser.email}
						</p>
						<p>
							<strong>Password:</strong> {firstUser.password}
						</p>
						<p>Please record your password before login.</p>
						<Button className="w-100" onClick={(e) => onLogin(e)}>
							Login
						</Button>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	if (showForm) {
		return (
			<Container className="d-flex justify-content-center mt-4 mb-4">
				<Card style={{ width: "100%", maxWidth: "400px" }}>
					<Card.Body>
						<h2 className="text-center mb-4">Please Create Your First User</h2>
						{formError && <Alert variant="danger">{formError}</Alert>}
						<Form onSubmit={handleCreateFirstUser}>
							<Form.Group id="name" className="mb-3">
								<Form.Label>User Name</Form.Label>
								<Form.Control
									type="name"
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

							<Button type="submit" className="w-100" disabled={loading}>
								Create User
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		);
	}
};

export default FirstUser;
