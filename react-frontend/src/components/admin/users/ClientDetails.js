import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const ClientDetails = ({ clients }) => {
	return (
		<Container>
			{clients && clients.length === 1 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Client</th>
							<th>Details</th>
						</tr>
					</thead>
					<tbody>
						{clients && (
							<>
								<tr>
									<td>Client Name</td>
									<td>{clients[0].c_name}</td>
								</tr>
								<tr>
									<td>Client Type</td>
									<td>{clients[0].c_type}</td>
								</tr>
								<tr>
									<td>Client Domain</td>
									<td>{clients[0].domain}</td>
								</tr>
								<tr>
									<td>User Count</td>
									<td>{clients[0].user_count}</td>
								</tr>
								<tr>
									<td>Licenses</td>
									<td>{clients[0].licenses}</td>
								</tr>
								<tr>
									<td>Last Updated</td>
									<td>{new Date(clients[0].updated_at).toLocaleString()}</td>
								</tr>
							</>
						)}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default ClientDetails;
