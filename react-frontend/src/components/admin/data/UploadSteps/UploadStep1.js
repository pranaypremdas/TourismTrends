import React, { useEffect, useRef } from "react";

// date functions
import { parse, format } from "date-fns";

// XLSX
import { read, utils } from "xlsx";

// Bootstrap Components
import { Container, Card, Form, Button } from "react-bootstrap";

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
	const fileInputRef = useRef(null); // Create a ref for the file input

	const handleFileUpload = (event) => {
		setState((s) => ({ ...s, processing: true }));
		const file = event.target.files[0];

		// prepare to read the file
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target.result);
				const workbook = read(data, { type: "array" });
				const jsonData = utils.sheet_to_json(
					workbook.Sheets[workbook.SheetNames[0]],
					{
						raw: false,
						dateNF: 'yyyy"-"mm"-"dd',
					}
				);

				let jsonTypes = Object.keys(jsonData[0]);

				// date from m/d/yy to yyyy-mm-dd
				let jsonDataDateFix = jsonData.map((row) => {
					let newRow = { ...row };

					if (row.hasOwnProperty("date")) {
						// Parse the date in m/d/yy format and format it to yyyy-MM-dd
						newRow.date = format(
							parse(row.date, "M/d/yy", new Date()),
							"yyyy-MM-dd"
						);
					}

					return newRow;
				});

				let colTypes = [];
				jsonTypes.forEach((type) => {
					if (type === "date") {
						colTypes.push({
							id: "date",
							colName: type,
						});
					} else {
						let foundTrend = state.trendTypes.find((t) => t.id === type);
						colTypes.push({
							id: type,
							colName: foundTrend ? foundTrend.id : "ignore",
						});
					}
				});

				setFormData((s) => ({
					...s,
					fileData: jsonDataDateFix,
					colTypes: colTypes,
				}));
			} catch (error) {
				setState((s) => ({ ...s, error: error }));
			} finally {
				setState((s) => ({ ...s, loading: false, processing: false }));
			}
		};
		// read the file
		reader.readAsArrayBuffer(file);
	};

	// check that all dates are different and of the format YYYY-MM-DD
	useEffect(() => {
		if (formData.fileData) {
			const dateArray = formData.fileData.map((d) => d.date);
			const uniqueDates = new Set(dateArray);

			// check if all dates are unique
			if (uniqueDates.size !== dateArray.length) {
				setState((s) => ({
					...s,
					message: "Duplicate dates found in the file, please check your data.",
				}));
			}

			let maxDate = dateArray.reduce((a, b) => (a > b ? a : b));
			let minDate = dateArray.reduce((a, b) => (a < b ? a : b));
			setFormData((s) => ({ ...s, startDate: minDate, endDate: maxDate }));
		}
	}, [formData.fileData]);

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
							ref={fileInputRef}
							onChange={handleFileUpload}
							disabled={state.loading}
							required
						/>
						{Boolean(formData.fileData) || (
							<>
								<Form.Text className="text-muted">
									Your CSV file should contain a header row with the following
									columns:
								</Form.Text>
								<Form.Text>
									<ul>
										<li>date (YYYY-MM-DD)</li>
										<li>Any number of valid data type columns</li>
									</ul>
								</Form.Text>
							</>
						)}

						{state.processing && <Form.Text>Processing file...</Form.Text>}
						{state.message && (
							<Form.Text className="warning">{state.message}</Form.Text>
						)}
					</Form.Group>

					<div className="d-flex justify-content-between">
						<Button
							variant="warning"
							onClick={() => {
								setFormData({
									name: "",
									lga: "",
									fileData: null,
									colTypes: [],
								});
								setState({ ...state, message: "", processing: false });
								if (fileInputRef.current) {
									fileInputRef.current.value = "";
								}
							}}
						>
							Reset
						</Button>
						{(formData.fileData && formData.name && formData.lga !== "" && (
							<Button
								onClick={() => setState((s) => ({ ...s, currentStep: 2 }))}
								disabled={state.processing || state.loading || state.error}
							>
								Review
							</Button>
						)) || <div></div>}
					</div>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default UploadStep1;
