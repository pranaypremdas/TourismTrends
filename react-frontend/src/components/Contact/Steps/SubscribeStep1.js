import React, { useEffect } from "react";

// Bootstrap Components
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

import testEmail from "../../lib/testEmail";

/**
 * SubscribeStep1 component renders a form for users to get a quote or contact the service.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client object.
 * @param {Function} props.setNewClient - Function to update the new client object.
 * @param {Array} props.state - The state object.
 * @param {Function} props.setState - Function to update the state object.
 *
 * @returns {JSX.Element} The rendered component.
 */
function SubscribeStep1({ newClient, setNewClient, state, setState }) {
	let { name, email, clientType, clientName, lgaIds, licenses } = newClient;
	let { formError } = state;

	const handleLocationChange = (e) => {
		const options = e.target.options;
		const selectedValues = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selectedValues.push(options[i].value);
			}
		}
		setNewClient((s) => ({ ...s, lgaIds: selectedValues }));
	};

	const handleLicensesChange = (e) => {
		let licenseCount = Math.ceil(Math.max(1, e.target.value));
		const minPricePerUser = 12.5; // Set a minimum price per user
		const basePrice = 25;
		const discount = (licenseCount / 100) * 15; // 15% discount of the license count

		const pricePerUser = Math.max(
			Math.round((basePrice - discount) * 100) / 100,
			minPricePerUser
		);
		setNewClient((s) => ({
			...s,
			licenses: licenseCount,
		}));
		setState((s) => ({
			...s,
			pricePerUser: pricePerUser,
		}));
	};

	// Calculates the price based on the user input
	const handleGetQuote = (e) => {
		e.preventDefault();
		setState((s) => ({
			...s,
			currentStep: 2,
			price: {
				type: clientType === "Government" ? 0 : 200,
				locations: lgaIds.length > 1 ? (lgaIds.length - 1) * 200 : 0,
				users: Math.round(licenses * s.pricePerUser * 100) / 100,
			},
		}));
	};

	useEffect(() => {
		if (!email) {
			setState((s) => ({ ...s, formError: null }));
		} else if (email && !testEmail(email)) {
			setState((s) => ({
				...s,
				formError: "Please enter a valid email address",
			}));
		} else if (
			!name ||
			!email ||
			!clientType ||
			!lgaIds ||
			!clientName ||
			!licenses
		) {
			setState((s) => ({
				...s,
				formError: "Please fill in all fields",
			}));
		} else {
			setState((s) => ({
				...s,
				formError: null,
			}));
		}
	}, [name, email, clientType, lgaIds, clientName, licenses]);

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Get A Quote / Contact Us</h2>
					<Form onSubmit={handleGetQuote}>
						<Form.Group className="mb-3" controlId="formName">
							<Form.Label>Your Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) =>
									setNewClient((s) => ({ ...s, name: e.target.value }))
								}
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) =>
									setNewClient((s) => ({ ...s, email: e.target.value }))
								}
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formClientTypeclientType">
							<Form.Label>Membership Type</Form.Label>
							<Form.Select
								value={clientType}
								onChange={(e) =>
									setNewClient((s) => ({ ...s, clientType: e.target.value }))
								}
								required
							>
								<option value="">Select an option</option>
								<option value="Government">
									Local Government or Tourism Body
								</option>
								<option value="Business">Business (Can Upload Own Data)</option>
							</Form.Select>
						</Form.Group>
						{!clientType && <p>Please select a membership type</p>}
						{clientType && (
							<Form.Group className="mb-3" controlId="formLocation">
								<Form.Label>
									{clientType === "Business" ? "Business" : "Organisation Name"}
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter your  name"
									value={clientName}
									onChange={(e) =>
										setNewClient((s) => ({ ...s, clientName: e.target.value }))
									}
									required
								/>
							</Form.Group>
						)}
						{clientType === "Business" && (
							<Form.Group className="mb-3" controlId="formLocationBus">
								<Form.Label>
									Select the Local Government Areas you operate in
								</Form.Label>
								<Form.Select
									multiple
									value={lgaIds}
									onChange={(e) => handleLocationChange(e)}
									required
								>
									{state.lgas.map((lga) => (
										<option key={lga.id} value={lga.id}>
											{lga.lga_name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}
						{clientType === "Government" && (
							<Form.Group className="mb-3" controlId="formLocationGov">
								<Form.Label>Which Local Government Area</Form.Label>
								<Form.Select
									value={lgaIds[0]}
									onChange={(e) =>
										setNewClient((s) => ({ ...s, lgaIds: [e.target.value] }))
									}
									required
								>
									<option value="">Select an option</option>
									{state.lgas.map((lga) => (
										<option key={lga.id} value={lga.id}>
											{lga.lga_name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						)}

						{name && email && clientType && lgaIds && (
							<>
								<Form.Group className="mb-3" controlId="formLicenlicenses">
									<Form.Label>How many users do you need?</Form.Label>
									<Form.Control
										type="number"
										value={licenses}
										onChange={(e) => handleLicensesChange(e)}
										required
									></Form.Control>
									<Form.Text className="text-muted">
										Each user costs ${state.pricePerUser} per year User Costs $
									</Form.Text>
								</Form.Group>

								<div className="d-flex justify-content-end mt-4">
									<Button variant="primary" type="submit" className="w-25">
										Get Price
									</Button>
								</div>
							</>
						)}
						{formError && <Alert variant="warning">{formError}</Alert>}
					</Form>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default SubscribeStep1;
