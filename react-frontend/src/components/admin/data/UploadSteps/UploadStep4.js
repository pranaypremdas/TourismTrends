import React from "react";

// Bootstrap Components
import { Container, Card, Button } from "react-bootstrap";

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
						<Button
							onClick={() => {
								setState((s) => ({
									...s,
									message: null,
									processing: false,
									loading: false,
									error: null,
									currentStep: 1,
								}));
								setFormData({
									name: "",
									lga: "",
									idTypes: { date: "", trendTypes: [], headers: [] },
									startDate: null,
									endDate: null,
									fileData: null,
									fileName: null,
								});
							}}
						>
							Restart
						</Button>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep3;
