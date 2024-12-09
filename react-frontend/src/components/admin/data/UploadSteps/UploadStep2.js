import React, { useEffect } from "react";

// Bootstrap Components
import { Container, Card, Form, Table, Button } from "react-bootstrap";

function UploadStep1({ state, setState, formData, setFormData }) {
	// handle the change of the select element
	const handleSelectChange = (e, index) => {
		const newIdTypes = [...formData.idTypes.trendTypes];
		newIdTypes[index] = { ...newIdTypes[index], colName: e.target.value };
		setFormData((s) => ({
			...s,
			idTypes: { ...s.idTypes, trendTypes: newIdTypes },
		}));
	};

	// check if a date and trend type is assigned
	useEffect(() => {
		if (formData.idTypes.date === "") {
			setState((s) => ({
				...s,
				message: "Please assign a date to a column",
				processing: true,
			}));
		} else if (
			formData.idTypes.trendTypes &&
			formData.idTypes.trendTypes.length > 0
		) {
			// check if a trend type is assigned
			const trendCol = formData.idTypes.trendTypes.find(
				(col) => col.colName !== "ignore"
			);
			if (!trendCol) {
				setState((s) => ({
					...s,
					message: "Please assign a trend type to at least 1 column",
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
	}, [formData.idTypes]);

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
									<td>Type</td>
									<td>Select Your Matching Type</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Date</td>
									<td>
										<Form.Select
											value={formData.idTypes.date}
											onChange={(e) => handleSelectChange(e)}
											disabled={state.loading}
											required
										>
											<option key={"ignore"} value={"ignore"}>
												Ignore
											</option>
											{formData.idTypes.headers.map((type) => (
												<option key={type} value={type}>
													{type}
												</option>
											))}
										</Form.Select>
									</td>
								</tr>

								{state.trendTypes.map((column, index) => (
									<tr key={"tt_key_" + column.id}>
										<td>{column.name}</td>
										<td>
											<Form.Select
												value={
													formData.idTypes.trendTypes.filter(
														(tt) => tt.id === column.id
													)[0].colName
												}
												onChange={(e) => handleSelectChange(e, index)}
												disabled={state.loading}
												required
											>
												<option key={"ignore"} value={"ignore"}>
													Ignore
												</option>
												{formData.idTypes.headers.map((type) => (
													<option key={type} value={type}>
														{type}
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
										stepBack: true,
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
