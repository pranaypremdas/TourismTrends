import React from "react";

// Bootstrap Components
import { Container, Card, Button } from "react-bootstrap";

// Custom Components
import QuoteTable from "./QuoteTable";

/**
 * SubscribeStep4 component renders a form for users to get a quote or contact the service.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client object.
 * @param {Object} props.state - The state object.
 *
 * @returns {JSX.Element} The rendered component.
 */
function SubscribeStep4({ newClient, state }) {
	let { name, quoteRef, expires_at } = newClient;

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
					{expires_at && (
						<Card.Text>
							This quote is valid until: <strong>{expires_at}</strong>
						</Card.Text>
					)}
					<QuoteTable newClient={newClient} state={state} />
					{state.type === "subscribe" && (
						<Card.Text>
							You will recieve an email shortly with the details of how to
							login.
						</Card.Text>
					)}
					{state.type === "renew" && (
						<>
							<Card.Text>
								Log out and log back in to see the changes to your account.
							</Card.Text>
							<Button href="/logout" variant="primary" className="mt-4">
								Log Out
							</Button>
						</>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
}

export default SubscribeStep4;
