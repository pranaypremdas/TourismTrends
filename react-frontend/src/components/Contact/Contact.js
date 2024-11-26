import React, { useEffect, useState } from "react";

// Bootstrap Components
import { Container, Form, Button, Card, Table } from "react-bootstrap";

// Custom Components
import getRequest from "../lib/getRequest";
import Error from "../Error/Error";
import Loading from "../Loading";
import postRequest from "../lib/postRequest";
import QuoteTable from "./QuoteTable";
import userPricing from "./userPricing";

const Contact = () => {
	// State variables for user input
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [locations, setLocations] = useState([]);
	const [businessType, setBusinessType] = useState("");
	const [clientName, setClientName] = useState("");
	const [userCount, setUserCount] = useState(1);
	const [message, setMessage] = useState("");
	const [lgas, setLgas] = useState([]);
	const [price, setPrice] = useState({ locations: 0, users: 0, type: 0 });

	// State variables for loading, error, and success
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [success, setSuccess] = useState(false);

	// State variable for the quote reference
	const [quoteRef, setQuoteRef] = useState("");

	// Save the quote to the database
	const handleSaveQuote = (e) => {
		e.preventDefault();
		const saveQuote = async () => {
			setLoading(true);
			const newClient = {
				name,
				email,
				clientName,
				clientType: businessType,
				lgaIds: locations.join(","),
				userCount,
				message,
				amount: price.type + price.locations + price.users,
				paymentMethod: "Credit Card",
			};

			const [response, error] = await postRequest(
				"client/subscribe",
				{ newClient: newClient },
				false
			);

			if (error) {
				console.error(error);
				setError(error);
			} else {
				setQuoteRef(response.quoteRef);
				setSuccess(true);
				setLoading(false);
			}
		};
		saveQuote();
	};

	// Calculates the price based on the user input
	const handleGetQuote = (e) => {
		e.preventDefault();
		setSubmitted(true);
		setPrice({
			type: businessType === "Government" ? 150 : 99,
			locations: locations.length > 1 ? (locations.length - 1) * 200 : 0,
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
		return <Loading />;
	}

	if (error) {
		return <Error message={error} />;
	}

	if (success) {
		return (
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				<Card className="p-4">
					<Card.Body>
						<h2 className="text-center mb-4">Thank You</h2>
						<Card.Text>
							Hi {name}, thank you for your interest in our services.
						</Card.Text>
						<Card.Text>
							Your payment reference is: <strong>{quoteRef}</strong>
						</Card.Text>
						<QuoteTable
							quotes={{
								businessType,
								locations,
								userCount,
								price,
								message,
								lgas,
							}}
						/>
						<Card.Text>
							You will recieve an email shortly with the details of how to
							login.
						</Card.Text>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	if (submitted && userCount >= 25) {
		return (
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				<Card className="p-4">
					<Card.Body>
						<h2 className="text-center mb-4">Contact Us</h2>
						<Card.Text>
							<p>Hi {name}, thank you for your interest in our services.</p>
							We offer custom pricing options for users greater than 20.
							<br />
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
							<br />
							<Container className="d-flex justify-content-between">
								<Button variant="primary" onClick={() => setSubmitted(false)}>
									Edit
								</Button>
								<Button
									variant="success"
									className="ms-2"
									onClick={(e) => handleSaveQuote(e)}
								>
									Contact Us
								</Button>
							</Container>
						</Card.Text>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	if (submitted) {
		return (
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				<Card className="p-4">
					<Card.Body>
						<h2 className="text-center mb-4">Price Summary</h2>

						<Card.Body>
							<QuoteTable
								quotes={{
									businessType,
									locations,
									userCount,
									price,
									message,
									lgas,
								}}
							/>
							<br />
							<Container className="d-flex justify-content-between">
								<Button variant="primary" onClick={() => setSubmitted(false)}>
									Back
								</Button>
								<Button
									variant="success"
									className="ms-2"
									onClick={(e) => handleSaveQuote(e)}
								>
									Buy Now
								</Button>
							</Container>
						</Card.Body>
					</Card.Body>
				</Card>
			</Container>
		);
	}

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Get A Quote / Contact Us</h2>
					<Form onSubmit={handleGetQuote}>
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
									Local Government or Tourism Body (Single Area)
								</option>
								<option value="Business">Business (Multiple Areas)</option>
							</Form.Select>
						</Form.Group>
						{!businessType && <p>Please select a membership type</p>}
						{businessType && (
							<Form.Group className="mb-3" controlId="formLocation">
								<Form.Label>
									{businessType === "Business"
										? "Business"
										: "Organisation" + " Name"}
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter your  name"
									value={clientName}
									onChange={(e) => setClientName([e.target.value])}
									required
								/>
							</Form.Group>
						)}
						{businessType === "Business" && (
							<Form.Group className="mb-3" controlId="formLocationBus">
								<Form.Label>
									Select the Local Government Areas you operate in
									<br />
									($200 / year for each additional location)
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
								<Form.Label>Which Local Government Area</Form.Label>
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
									<Form.Control
										type="number"
										value={userCount}
										onChange={(e) => setUserCount(e.target.value)}
										required
									></Form.Control>
								</Form.Group>

								<div className="d-flex justify-content-end mt-4">
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
