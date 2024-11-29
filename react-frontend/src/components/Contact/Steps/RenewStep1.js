import React, { useContext } from "react";

// Bootstrap Components
import { Container, Button, Card, Table } from "react-bootstrap";

// Custom Components
import userPricing from "./userPricing";

// Contexts
import { UserContext } from "../../../contexts/UserContext";

function RenewStep1({ newClient, setNewClient, state, setState }) {
	const { user } = useContext(UserContext);
	return (
		<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
			<Card>
				<Card.Header>
					<h2>Renew Subscription</h2>
				</Card.Header>
				<Card.Body>
					{newClient && (
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Client</th>
									<th>Details</th>
								</tr>
							</thead>
							<tbody>
								{newClient && (
									<>
										<tr>
											<td>Client Name</td>
											<td>{newClient.clientName}</td>
										</tr>
										<tr>
											<td>Client Type</td>
											<td>{newClient.clientType}</td>
										</tr>
										<tr>
											<td>Licenses</td>
											<td>{newClient.licenses}</td>
										</tr>
										<tr>
											<td>Local Government Areas</td>
											<td>{newClient.lgas.join(", ")}</td>
										</tr>
										<tr>
											<td>Expired At</td>
											<td>
												{new Date(newClient.expires_at).toLocaleDateString()}
											</td>
										</tr>
										<tr>
											<td>Expired</td>
											<td>{user.expired ? "Yes" : "No"}</td>
										</tr>
										<tr>
											<td></td>
											<td>
												<Button
													variant="primary"
													onClick={() =>
														setState((s) => ({
															...s,
															currentStep: 2,
															price: {
																type:
																	newClient.clientType === "Government"
																		? 150
																		: 99,
																locations:
																	newClient.lgaIds.length > 1
																		? (newClient.lgaIds.length - 1) * 200
																		: 0,
																users:
																	newClient.licenses *
																	userPricing[newClient.licenses],
															},
														}))
													}
												>
													Get Quote
												</Button>
											</td>
										</tr>
									</>
								)}
							</tbody>
						</Table>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
}

export default RenewStep1;
