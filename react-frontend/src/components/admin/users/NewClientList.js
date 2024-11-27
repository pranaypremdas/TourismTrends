import React from "react";

// Bootstrap Components
import { Container, Table, Button, ButtonGroup } from "react-bootstrap";
import postRequest from "../../lib/postRequest";

const NewClientList = ({ clients }) => {
	const registerClient = (id) => {
		const data = {
			createClient: {
				client_id: id,
			},
		};

		const register = async () => {
			const [response, error] = await postRequest("client/new/process", data);
			if (error) {
				console.error("Error: ", error);
			} else {
				console.log("Response: ", response);
			}
		};
		register();
	};

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
							<th>Actions</th>
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
									<td>
										<ButtonGroup>
											<Button
												variant="primary"
												size="sm"
												onClick={() => registerClient(client.id)}
											>
												Create Account
											</Button>
										</ButtonGroup>
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default NewClientList;
