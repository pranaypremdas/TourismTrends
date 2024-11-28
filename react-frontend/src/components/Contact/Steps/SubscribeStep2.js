import React from "react";

// Bootstrap Components
import { Container, Form, Button, Card } from "react-bootstrap";

// Custom Components
import QuoteTable from "./QuoteTable";

/**
 * SubscribeStep2 component renders a form for users to get a quote or contact the service.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client object.
 * @param {Object} props.setNewClient - The new client object.
 * @param {Object} props.state - The state object.
 * @param {Function} props.setState - Function to update the state object.
 *
 * @returns {JSX.Element} The rendered component.
 */
function SubscribeStep2({ newClient, setNewClient, state, setState }) {
	// let { name, email, clientType, clientName, lgaIds, licenses } = newClient;

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Price Summary</h2>

					<Card.Body>
						<QuoteTable newClient={newClient} state={state} />
						<br />
						<Container className="d-flex justify-content-between">
							<Button
								variant="primary"
								onClick={() => setState((s) => ({ ...s, currentStep: 1 }))}
							>
								Back
							</Button>
							<Button
								variant="success"
								className="ms-2"
								onClick={() =>
									setState((s) => ({
										...s,
										paymentMethod: "Dummy Payment",
										currentStep: 3,
									}))
								}
							>
								Make Payment
							</Button>
						</Container>
					</Card.Body>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default SubscribeStep2;
