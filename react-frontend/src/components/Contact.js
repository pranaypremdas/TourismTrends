import React, { useEffect, useState } from "react";

// Bootstrap Components
import { Container, Form, Button, Card, Table } from "react-bootstrap";

// Custom Components
import getRequest from "./lib/getRequest";

const Contact = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [locations, setLocations] = useState([]);
	const [businessType, setBusinessType] = useState("");
	const [userCount, setUserCount] = useState(1);
	const [message, setMessage] = useState("");
	const [lgas, setLgas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [price, setPrice] = useState({ locations: 0, users: 0, type: 0 });

	const userPricing = {
		1: 25,
		5: 20,
		10: 18,
		15: 16,
		20: 14,
	};

	// For now only logs to console need to impliment logic for adding to database
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		setPrice({
			type: businessType === "Government" ? 150 : 99,
			locations: locations.length > 1 ? (locations.length - 1) * 400 : 0,
			users: userCount * userPricing[userCount],
		});
	};

	// Fetches the list of local government areas
	useEffect(() => {
		const getLgas = async () => {
			setLoading(true);
			setError(null);
			const [data, error] = await getRequest("lga/list", false);
			if (error) {
				console.error(error);
				setError(error);
			} else {
				setLgas(data.results);
			}
			setLoading(false);
		};

		getLgas();
	}, []);

	const handleLocationChange = (e) => {
		const options = e.target.options;
		const selectedValues = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selectedValues.push(options[i].value);
			}
		}
		setLocations(selectedValues);
	};

	if (loading) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ minHeight: "100vh" }}
			>
				<h2>Loading...</h2>
			</Container>
		);
	}

	if (error) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ minHeight: "100vh" }}
			>
				<h2>Error: {error.message}</h2>
			</Container>
		);
	}

	if (submitted) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ minHeight: "100vh" }}
			>
				<Card className="p-4">
					<Card.Body>
						<h2 className="text-center mb-4">Price Summary</h2>

						<Card.Text>
							Hi {name}, thank you for your interest in our services.
							<br />
							Here's a summary of your request:
							<br />
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Option</th>
										<th>Selection</th>
										<th>Price</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Membership Type</td>
										<td>{businessType}</td>
										<td>{price.type}</td>
									</tr>
									<tr>
										<td>Locations</td>
										<td>
											{locations.map((location, index) => {
												if (index === locations.length - 1) {
													return `${
														lgas[Number.parseInt(location) - 1].lga_name
													}`;
												}
												return `${
													lgas[Number.parseInt(location) - 1].lga_name
												}, `;
											})}
										</td>
										<td>{price.locations}</td>
									</tr>
									<tr>
										<td>Users</td>
										<td>
											{userCount} * ${userPricing[userCount]} / year
										</td>
										<td>${price.users}</td>
									</tr>
									<tr>
										<td>Total</td>
										<td></td>
										<td>${price.type + price.locations + price.users}</td>
									</tr>
								</tbody>
							</Table>
							<br />
							{message && <>Message: {message}</>}
							<br />
							<Button variant="primary" onClick={() => setSubmitted(false)}>
								Edit
							</Button>
							<Button variant="success" className="ms-2">
								Add to Cart
							</Button>
						</Card.Text>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	return (
		<Container className="mt-5">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Get A Quote / Contact Us</h2>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formName">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBusinessType">
							<Form.Label>Membership Type</Form.Label>
							<Form.Select
								value={businessType}
								onChange={(e) => setBusinessType(e.target.value)}
								required
							>
								<option value="">Select an option</option>
								<option value="Government">
									Local Government or Tourism Body (single location available)
								</option>
								<option value="Business">Business (Multiple Areas)</option>
							</Form.Select>
						</Form.Group>
						{businessType === "Business" && (
							<Form.Group className="mb-3" controlId="formLocationBus">
								<Form.Label>
									Select All Locations you want (First location free, $400 /
									year for all additional locations)
								</Form.Label>
								<Form.Select
									multiple
									value={locations}
									onChange={(e) => handleLocationChange(e)}
									required
								>
									{lgas.map((lga) => (
										<option key={lga.id} value={lga.id}>
											{lga.lga_name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}
						{businessType === "Government" && (
							<Form.Group className="mb-3" controlId="formLocationGov">
								<Form.Label>Single Local Government Area</Form.Label>
								<Form.Select
									value={locations[0]}
									onChange={(e) => setLocations([e.target.value])}
									required
								>
									<option value="">Select an option</option>
									{lgas.map((lga) => (
										<option key={lga.id} value={lga.id}>
											{lga.lga_name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}

						{name && email && businessType && locations && (
							<>
								<Form.Group className="mb-3" controlId="formUserCount">
									<Form.Label>How many users do you need?</Form.Label>
									<Form.Select
										value={userCount}
										onChange={(e) => setUserCount(e.target.value)}
										required
									>
										<option value={1}>1 ($25 / user)</option>
										<option value={5}>5 ($20 / user)</option>
										<option value={10}>10 ($18 / user)</option>
										<option value={15}>15 ($16 / user)</option>
										<option value={20}>20 ($14 / user)</option>
										<option value={99}>
											Contact us for other pricing options
										</option>
									</Form.Select>
								</Form.Group>

								<Form.Group controlId="formBasicMessage">
									<Form.Label>Message</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										placeholder="Enter your message here"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
								</Form.Group>
								<div className="d-flex justify-content-end">
									<Button variant="primary" type="submit" className="w-25">
										Get Quote
									</Button>
								</div>
							</>
						)}
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Contact;
