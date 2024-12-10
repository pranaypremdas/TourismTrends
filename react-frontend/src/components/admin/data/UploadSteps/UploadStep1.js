import React, { useEffect } from "react";

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
 * @param {Object} props.fileInputRef - The reference to the file input element.
 *
 * @returns {JSX.Element} The UploadStep1 component.
 */
function UploadStep1({
	state,
	setState,
	formData,
	setFormData,
	user,
	fileInputRef,
}) {
	const handleFileUpload = (event) => {
		setState((s) => ({ ...s, processing: true, message: null, error: null }));
		const file = event.target.files[0];

		// prepare to read the file
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target.result);
				const workbook = read(data, { type: "array" });
				const workbookData = utils.sheet_to_json(
					workbook.Sheets[workbook.SheetNames[0]],
					{
						raw: false,
						dateNF: 'yyyy"-"mm"-"dd',
					}
				);

				let headers = Object.keys(workbookData[0]);

				// date from m/d/yy to yyyy-mm-dd
				let workbookDataDateFix = workbookData.map((row) => {
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

				let idTypes = {
					date: "",
					trendTypes: state.trendTypes.map((tt) => ({ ...tt, colName: "" })),
					headers: headers,
				};
				headers.forEach((type) => {
					if (type === "date") {
						idTypes.date = type;
					}
				});

				setFormData((s) => ({
					...s,
					fileName: file.name,
					fileData: workbookDataDateFix,
					idTypes: idTypes,
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
	}, [formData.fileData, setFormData, setState]);

	// Render the component
	return (
		<Container
			className="d-flex justify-content-center align-items-top mt-4 mb-4"
			style={{ minWidth: "600px" }} // Add minimum width
		>
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
						{Boolean(formData.fileData) || (
							<>
								<Form.Control
									type="file"
									accept=".csv"
									ref={fileInputRef}
									onChange={handleFileUpload}
									disabled={state.loading}
									required
									style={{ width: "100%" }} // Ensure the file input has the same width
								/>

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
						{Boolean(formData.fileData) && (
							<>
								<Form.Control
									type="text"
									value={formData.fileName}
									disabled
									required
									style={{ width: "100%" }} // Ensure the text input has the same width
								/>

								<Form.Text className="text-muted">
									{formData.fileData.length} rows of data found in the file.
								</Form.Text>
								<Form.Text className="text-muted">
									<ul>
										<li>From: {formData.startDate}</li>
										<li>To: {formData.endDate}</li>
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
								onClick={() =>
									setState((s) => ({ ...s, currentStep: 2, stepBack: false }))
								}
								disabled={
									state.processing ||
									state.loading ||
									state.error ||
									state.message
								}
							>
								Identify Data
							</Button>
						)) || <div></div>}
					</div>
				</Card.Body>
			</Card>
		</Container>
	);
}

export default UploadStep1;
