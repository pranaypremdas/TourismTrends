import React, { useContext, useState } from "react";

// XLSX
import { read, utils } from "xlsx";

// Bootstrap Components
import { Container, Card, Form } from "react-bootstrap";

// User Contexts
import { UserContext } from "../../../contexts/UserContext";

// Custom Components

function UploadData({ lgas }) {
	const { user } = useContext(UserContext);
	const [selectedLga, setSelectedLga] = useState("");

	console.log(lgas);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = new Uint8Array(e.target.result);
			const workbook = read(data, { type: "array" });
			const jsonData = utils.sheet_to_json(
				workbook.Sheets[workbook.SheetNames[0]]
			);
			console.log(jsonData);
		};
		reader.readAsArrayBuffer(file);
	};

	const handleLgaChange = (event) => {
		setSelectedLga(event.target.value);
	};

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Body>
					<h2 className="text-center mb-4">Get A Quote / Contact Us</h2>
					<Form.Group className="mb-3" controlId="formName">
						<Form.Label>Location</Form.Label>
						<Form.Select value={selectedLga} onChange={handleLgaChange}>
							<option value="">Select Location</option>
							{user.client.lgaIds.map((id) => {
								const lga = lgas.find((lga) => lga.id === id);
								return (
									<option key={id} value={id}>
										{lga ? lga.lga_name : "Unknown"}
									</option>
								);
							})}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formFile">
						<Form.Label>Upload Data</Form.Label>
						<Form.Control
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
					</Form.Group>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default UploadData;
