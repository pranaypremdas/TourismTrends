import React, { useEffect } from "react";

// Bootstrap Components
import { Container, Card, Form, Table, Button } from "react-bootstrap";

function UploadStep1({ state, setState, formData, setFormData }) {
	const handleSelectChange = (e, index) => {
		const newColTypes = [...formData.colTypes];
		newColTypes[index] = { ...newColTypes[index], colName: e.target.value };
		setFormData((s) => ({
			...s,
			colTypes: newColTypes,
		}));
	};

	useEffect(() => {
		if (formData.colTypes && formData.colTypes.length > 0) {
			// check if date is assigned
			const dateCol = formData.colTypes.find((col) => col.colName === "date");
			// check if a trend type is assigned
			const trendCol = formData.colTypes.find(
				(col) => col.colName !== "ignore" && col.colName !== "date"
			);
			if (!dateCol || !trendCol) {
				setState((s) => ({
					...s,
					message: "Please assign a date and a trend type to columns",
					processing: true,
				}));
			} else {
				setState((s) => ({
					...s,
					message: null,
					processing: false,
				}));
			}
		}
	}, [formData.colTypes]);

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			{formData.fileData && (
				<Card className="p-4">
					<Card.Title className="text-center">
						<h5>Identify Data</h5>
					</Card.Title>
					<Card.Body>
						<Table>
							<thead>
								<tr>
									<td>Column</td>
									<td>Data Type</td>
								</tr>
							</thead>
							<tbody>
								{formData.colTypes.map((column, index) => (
									<tr key={index}>
										<td>{column.id}</td>
										<td>
											<Form.Select
												value={column.colName}
												onChange={(e) => handleSelectChange(e, index)}
												disabled={state.loading}
												required
											>
												<option key={"ignore"} value={"ignore"}>
													Ignore
												</option>
												<option key={"date"} value={"date"}>
													Date
												</option>
												{state.trendTypes.map((type) => (
													<option key={type.id} value={type.id}>
														{type.name}
													</option>
												))}
											</Form.Select>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						{state.message && (
							<Form.Text className="warning">{state.message}</Form.Text>
						)}

						<div className="d-flex justify-content-between">
							<Button
								variant="secondary"
								onClick={() =>
									setState((s) => ({
										...s,
										currentStep: 1,
										message: null,
										processing: false,
										error: null,
									}))
								}
							>
								Back
							</Button>
							{(formData.fileData && (
								<Button
									onClick={() => setState((s) => ({ ...s, currentStep: 3 }))}
									disabled={state.processing || state.message}
								>
									Review
								</Button>
							)) || <div></div>}
						</div>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep1;
