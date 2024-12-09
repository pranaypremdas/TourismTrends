import React, { useEffect } from "react";

// Bootstrap Components
import { Container, Card, Table, Button } from "react-bootstrap";

// custom components
import postRequest from "../../../lib/postRequest";

function UploadStep3({ state, setState, formData, setFormData }) {
	// send the data to the server
	const handleUpload = async () => {
		const data = formData.fileData.map((row) => {
			let newRow = {};
			formData.idTypes.trendTypes.forEach((col) => {
				newRow[col.id] = row[col.col];
			});
			return newRow;
		});

		setState((s) => ({ ...s, loading: true, error: null }));
		let [response, error] = await postRequest("trends/user/add", {
			upload: formData,
		});
		if (error) {
			setState((s) => ({ ...s, loading: false, error }));
		} else {
			// setState((s) => ({ ...s, loading: false, currentStep: 4 }));
			console.log(response);
		}
	};

	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			{formData.fileData && (
				<Card className="p-4">
					<Card.Title className="text-center">
						<h5>Validate Data</h5>
					</Card.Title>
					<Card.Body>
						<Card.Text>First 10 rows of the uploaded data...</Card.Text>
						<Table>
							<thead>
								<tr>
									<td key={"header_row"}>Row</td>
									<td key={"header_date"}>Date</td>
									{formData.idTypes.trendTypes.map((column, index) => {
										return (
											column.colName !== "ignore" && (
												<td key={"header_" + column.id}>{column.name}</td>
											)
										);
									})}
								</tr>
							</thead>
							<tbody>
								{formData.fileData.slice(0, 10).map((row, index) => (
									<tr key={index}>
										<td key={"row_" + index}>{index + 1}</td>
										<td key={"row_date_" + index}>{row.date}</td>
										{formData.idTypes.trendTypes.map(
											(column, index) =>
												column.colName !== "ignore" && (
													<td key={"row_" + index}>{row[column.colName]}</td>
												)
										)}
									</tr>
								))}
							</tbody>
						</Table>
						<div className="d-flex justify-content-between">
							<Button
								variant="secondary"
								onClick={() =>
									setState((s) => ({
										...s,
										currentStep: 2,
										message: null,
										processing: false,
										error: null,
									}))
								}
							>
								Back
							</Button>
							<Button onClick={() => handleUpload()}>Upload</Button>
						</div>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep3;
