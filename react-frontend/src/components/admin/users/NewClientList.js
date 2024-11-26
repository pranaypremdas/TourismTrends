import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const NewClientList = ({ clients }) => {
	return (
		<Container>
			{clients && clients.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Client Name</th>
							<th>Client Type</th>
							<th>Primary Contact</th>
							<th>Licenses</th>
							<th>Payment Ref</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{clients &&
							clients.map((client) => (
								<tr key={client.id}>
									<td>{client.clientName}</td>
									<td>{client.clientType}</td>
									<td>
										{client.name}
										<br />({client.email})
									</td>
									<td>{client.userCount}</td>
									<td>{client.quoteRef}</td>
									<td>{new Date(client.updated_at).toLocaleString()}</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default NewClientList;
