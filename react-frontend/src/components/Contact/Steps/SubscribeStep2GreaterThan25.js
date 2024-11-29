import React from "react";

// Bootstrap Components
import { Container, Form, Button, Card } from "react-bootstrap";

// Custom Components
import QuoteTable from "./QuoteTable";
import handleSavePayment from "./handleSavePayment";

/**
 * SubscribeStep2GreaterThan25 component renders a form for users to get a quote or contact the service.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client object.
 * @param {Function} props.setNewClient - Function to update the new client object.
 * @param {Object} props.state - The state object.
 * @param {Function} props.setState - Function to update the state object.
 *
 * @returns {JSX.Element} The rendered component.
 */
function SubscribeStep2GreaterThan25({
	newClient,
	setNewClient,
	state,
	setState,
}) {
	let { name, message } = newClient;

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Contact Us</h2>
					<Card.Text>
						<p>Hi {name}, thank you for your interest in our services.</p>
						We offer custom pricing options for users greater than 20.
						<br />
						<QuoteTable newClient={newClient} state={state} />
						<Form.Group controlId="formBasicMessage">
							<Form.Label>Message</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter your message here"
								value={message}
								onChange={(e) =>
									setNewClient((s) => ({ ...s, message: e.target.value }))
								}
							/>
						</Form.Group>
						<br />
						<Container className="d-flex justify-content-between">
							<Button
								variant="primary"
								onClick={() => setState((s) => ({ ...s, submitted: false }))}
							>
								Edit
							</Button>
							<Button
								variant="success"
								className="ms-2"
								onClick={(e) =>
									handleSavePayment(e, state, setState, newClient, setNewClient)
								}
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

export default SubscribeStep2GreaterThan25;
