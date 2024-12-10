import React from "react";

// Bootstrap Components
import { Container, Card } from "react-bootstrap";

function UploadStep3({ state, setState, formData, setFormData }) {
	// send the data to the server

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			{formData.fileData && (
				<Card className="p-4">
					<Card.Title className="text-center">
						<h5>Complete</h5>
					</Card.Title>
					<Card.Body>
						<Card.Text>Upload is Complete</Card.Text>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep3;
