import React, { useContext, useState } from "react";

// XLSX
import { read, utils } from "xlsx";

// Bootstrap Components
import { Container, Card, Form } from "react-bootstrap";

// User Contexts
import { UserContext } from "../../../contexts/UserContext";

// Custom Components
import Error from "../../Error/Error";

function UploadData({ lgas, trendTypes }) {
	const { user } = useContext(UserContext);

	const [error, setError] = useState(null);
	const [loadingFile, setLoadingFile] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		lga: "",
		dateColumn: "",
		dataColumn: "",
		dataType: "",
		fileData: null,
		dataTypes: [],
	});

	/**
	 * Handles the file upload event, reads the file, and processes its data.
	 *
	 * @param {Event} event - The file input change event.
	 * @returns {void}
	 */
	const handleFileUpload = (event) => {
		setLoadingFile(true);
		setFormData((s) => ({ ...s, fileData: null }));
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target.result);
				const workbook = read(data, { type: "array" });
				const jsonData = utils.sheet_to_json(
					workbook.Sheets[workbook.SheetNames[0]]
				);
				let jsonTypes = Object.keys(jsonData[0]);
				let dateColIndex = jsonTypes.findIndex((type) => type.includes("date"));
				let dataColIndex = jsonTypes.findIndex((type) =>
					trendTypes.public.map((tt) => tt.id).includes(type)
				);

				setFormData((s) => ({
					...s,
					fileData: jsonData,
					dataTypes: jsonTypes,
					dateColumn: dateColIndex > -1 ? dateColIndex : "",
					dataColumn: dataColIndex > -1 ? dataColIndex : "",
				}));
			} catch (error) {
				setError(error.message);
			}
			setLoadingFile(false);
		};
		reader.readAsArrayBuffer(file);
	};

	console.log(formData);

	if (error) {
		return <Error error={error} />;
	}

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card className="p-4">
				<Card.Title className="text-center">
					<h5>Upload CSV</h5>
				</Card.Title>
				<Card.Body>
					<Form.Group className="mb-3" controlId="formName">
						<Form.Label>Upload Identifier/Name</Form.Label>
						<Form.Control
							type="text"
							disabled={loadingFile}
							value={formData.name}
							onChange={(e) =>
								setFormData((s) => ({ ...s, name: e.target.value }))
							}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formName">
						<Form.Label>Local Government Area</Form.Label>
						<Form.Select
							value={formData.lga}
							onChange={(e) =>
								setFormData((s) => ({ ...s, lga: e.target.value }))
							}
							disabled={loadingFile}
							required
						>
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
						<Form.Label>Upload Data (CSV)</Form.Label>
						<Form.Control
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
							disabled={loadingFile}
							required
						/>
					</Form.Group>
				</Card.Body>
			</Card>

			{formData.fileData && (
				<Card className="p-4">
					<Card.Title className="text-center">
						<h5>Identify Data</h5>
					</Card.Title>
					<Card.Body>
						<>
							<Form.Group className="mb-3" controlId="formDataType">
								<Form.Label>Identify Date</Form.Label>
								{formData.dataTypes.map((type) => (
									<Form.Check
										type="radio"
										label={type}
										name="dateColumn"
										id={type}
										key={type}
										disabled={loadingFile}
										onChange={(e) =>
											setFormData((s) => ({
												...s,
												dateColumn: formData.dataTypes.indexOf(e.target.id),
											}))
										}
										defaultChecked={
											formData.dateColumn === formData.dataTypes.indexOf(type)
										}
									/>
								))}
							</Form.Group>
							<Form.Group className="mb-3" controlId="formDataType">
								<Form.Label>Identify Data Column</Form.Label>
								{formData.dataTypes.map((type) => (
									<Form.Check
										type="radio"
										label={type}
										name="dataColumn"
										id={type}
										key={type}
										disabled={loadingFile}
										onChange={(e) =>
											setFormData((s) => ({
												...s,
												dataColumn: formData.dataTypes.indexOf(e.target.id),
											}))
										}
										defaultChecked={
											formData.dataColumn === formData.dataTypes.indexOf(type)
										}
									/>
								))}
							</Form.Group>

							<Form.Group className="mb-3" controlId="formDataType">
								<Form.Label>Identify Data Type</Form.Label>
								{trendTypes.public.map((type) => (
									<Form.Check
										type="radio"
										label={type.name}
										name="dataType"
										id={type.id}
										key={type.id}
										disabled={loadingFile}
										onChange={(e) =>
											setFormData((s) => ({
												...s,
												dataType: e.target.id,
											}))
										}
										defaultChecked={formData.dataType === type.id}
									/>
								))}
							</Form.Group>
						</>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadData;
