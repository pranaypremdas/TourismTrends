import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const ClientList = ({ clients }) => {
	return (
		<Container>
			{clients && clients.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Client Name</th>
							<th>Client Type</th>
							<th>Client Domain</th>
							<th>User Count</th>
							<th>Licenses</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{clients &&
							clients.map((client) => (
								<tr key={client.id}>
									<td>{client.c_name}</td>
									<td>{client.c_type}</td>
									<td>{client.domain}</td>
									<td>{client.user_count}</td>
									<td>{client.licenses}</td>
									<td>{new Date(client.updated_at).toLocaleString()}</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default ClientList;
