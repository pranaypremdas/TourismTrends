import React from "react";

// Bootstrap Components
import { Container, Card, Form, Table } from "react-bootstrap";

function UploadStep1({ state, setState, formData, setFormData }) {
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
												onChange={(e) => {
													const newColTypes = formData.colTypes.map((col) => {
														if (col.id === column.id) {
															return {
																...col,
																colName: e.target.value,
															};
														}
														return col;
													});
													setFormData((s) => ({
														...s,
														colTypes: newColTypes,
													}));
												}}
												disabled={state.loading}
												required
											>
												<option key={"ignore"} value={"ignore"}>
													Ignore
												</option>
												<option key={"date"} value={"date"}>
													Date
												</option>
												{state.trendTypes.public.map((type) => (
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
					</Card.Body>
				</Card>
			)}
		</Container>
	);
}

export default UploadStep1;
