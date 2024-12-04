import React from "react";

// XLSX
import { read, utils } from "xlsx";

// Bootstrap Components
import { Container, Card, Form } from "react-bootstrap";



/**
 * Component for the first step of the upload process.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.state - The current state of the component.
 * @param {Function} props.setState - Function to update the state.
 * @param {Object} props.formData - The form data state.
 * @param {Function} props.setFormData - Function to update the form data state.
 * @param {Object} props.user - The user object containing user-specific data.
 *
 * @returns {JSX.Element} The UploadStep1 component.
 */
function UploadStep1({ state, setState, formData, setFormData, user }) {
	const handleFileUpload = (event) => {
		setFormData((s) => ({ ...s, fileData: null }));
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target.result);
				const workbook = read(data, { type: "array" });
				const jsonData = utils.sheet_to_json(
					workbook.Sheets[workbook.SheetNames[0]],
					{ raw: false, dateNF: "yyyy-mm-dd" } // Add dateNF option to format dates
				);

				// Ensure date format remains "yyyy-mm-dd"
				let jsonDataWithDate = jsonData.map((row) => {
					let newRow = { ...row };
					Object.keys(row).forEach((key) => {
						if (key === "date") {
							newRow[key] = new Date(row[key]).toISOString().split("T")[0];
						}
					});
					return newRow;
				});

				let jsonTypes = Object.keys(jsonDataWithDate[0]);

				let colTypes = [];
				jsonTypes.forEach((type) => {
					if (type === "date") {
						colTypes.push({
							id: "date",
							colName: type,
						});
					} else {
						let foundTrend = state.trendTypes.public.find((t) => t.id === type);
						colTypes.push({
							id: type,
							colName: foundTrend ? foundTrend.id : "ignore",
						});
					}
				});

				setFormData((s) => ({
					...s,
					fileData: jsonDataWithDate,
					colTypes: colTypes,
				}));
			} catch (error) {
				setState((s) => ({ ...s, error: error }));
			} finally {
				setState((s) => ({ ...s, loading: false }));
			}
		};
		reader.readAsArrayBuffer(file);
	};

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
							disabled={state.loading}
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
							disabled={state.loading}
							required
						>
							<option value="">Select Location</option>
							{user.client.lgaIds.map((id) => {
								const lga = state.lgas.find((lga) => lga.id === id);
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
							disabled={state.loading}
							required
						/>
						<Form.Text className="text-muted">
							Your CSV file should contain a header row with the following
							columns:
						</Form.Text>
						<Form.Text>
							<ul>
								<li>"date" (yyyy-mm-dd)</li>
								<li>Any number of valid data type columns</li>
							</ul>
						</Form.Text>
					</Form.Group>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default UploadStep1;
