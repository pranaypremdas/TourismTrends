import React from "react";

// Bootstrap Spinner
import { Container, Card, Spinner } from "react-bootstrap";

/**
 * Loading component that displays a centered spinner inside a card.
 *
 * This component uses Bootstrap classes to center the spinner both
 * vertically and horizontally within the viewport. The spinner is
 * wrapped inside a card for better visual presentation.
 *
 * @component
 * @example
 * return (
 *   <Loading />
 * )
 */
const Loading = () => {
	return (
		<Container
			className="d-flex justify-content-center align-items-center mt-4 mb-4"
			style={{ minHeight: "100vh" }}
		>
			<Card style={{ width: "100%", maxWidth: "400px" }}>
				<Card.Body>
					<Spinner animation="border" role="status">
						{/* <span className="visually-hidden">Loading...</span> */}
					</Spinner>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Loading;
