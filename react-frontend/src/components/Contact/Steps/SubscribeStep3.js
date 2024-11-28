import React from "react";

// Bootstrap Components
import { Container, Card, Button } from "react-bootstrap";

// Custom Components
import handleSavePayment from "./handleSavePayment";

/**
 * SubscribeStep3 component renders a form for users to get a quote or contact the service.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client object.
 * @param {Object} props.setNewClient - Function to update the new client object.
 * @param {Object} props.state - The state object.
 * @param {Function} props.setState - Function to update the state object.
 *
 * @returns {JSX.Element} The rendered component.
 */
function SubscribeStep3({ newClient, setNewClient, state, setState }) {
	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Payment</h2>
					<Card.Text>DUMMY PAYMENT PAGE</Card.Text>
					<Button
						variant="success"
						className="mt-4"
						onClick={(e) =>
							handleSavePayment(e, state, setState, newClient, setNewClient)
						}
					>
						Complete Payment
					</Button>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default SubscribeStep3;
