import React, { useEffect } from "react";

// Bootstrap Components
import { Container, Card, Table, Button } from "react-bootstrap";

// custom components
import postRequest from "../../../lib/postRequest";

function UploadStep3({ state, setState, formData, setFormData }) {
	const handleUpload = async () => {
		const data = formData.fileData.map((row) => {
			let newRow = {};
			formData.colTypes.forEach((col) => {
				newRow[col.id] = row[col.col];
			});
			return newRow;
		});
		const upload = {
			name: formData.name,
			description: formData.description,
			region: formData.region,
			trendsTypes: formData.colTypes.map((col) => col.id),
		};

		setState((s) => ({ ...s, loading: true, error: null }));
		let [response, error] = await postRequest("trends/user/add", {
			data: data,
			upload: upload,
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
									{formData.colTypes.map((column, index) => {
										if (column.colName === "date") {
											return <td key={"header_date"}>Date</td>;
										}

										let foundType = state.trendTypes.find(
											(tt) => tt.id === column.colName
										);

										return (
											column.colName !== "ignore" &&
											foundType && (
												<td key={"header_" + foundType.id}>{foundType.name}</td>
											)
										);
									})}
								</tr>
							</thead>
							<tbody>
								{formData.fileData.slice(0, 10).map((row, index) => (
									<tr key={index}>
										<td key={"row_" + index}>{index + 1}</td>
										{formData.colTypes.map(
											(column, index) =>
												column.colName !== "ignore" && (
													<td key={"row_" + index}>{row[column.id]}</td>
												)
										)}
									</tr>
								))}
							</tbody>
						</Table>
						<div className="d-flex justify-content-end">
							<Button onClick={() => handleUpload()}>Upload</Button>
						</div>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep3;
