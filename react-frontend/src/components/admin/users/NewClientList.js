import React from "react";

// Bootstrap Components
import { Container, Table, Button, ButtonGroup } from "react-bootstrap";
import postRequest from "../../lib/postRequest";

const NewClientList = ({ clients }) => {
	const registerClient = (id) => {
		const data = {
			client_id: id,
			user_id: 1,
		};

		const register = async () => {
			const [response, error] = await postRequest("client/update", data);
			if (error) {
				console.error("Error: ", error);
			} else {
				console.log("Response: ", response);
			}
		};
		register();
	};

	const deleteClient = (id) => {
		console.log("Client ID: ", id);
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
												Create Client Account
											</Button>
											{/* <Button
												variant="danger"
												size="sm"
												onClick={() => deleteClient(client.id)}
											>
												Delete
											</Button> */}
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
