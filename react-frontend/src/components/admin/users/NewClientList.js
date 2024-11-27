import React, { useState } from "react";

// Bootstrap Components
import { Container, Table, Button, ButtonGroup } from "react-bootstrap";
import Error from "../../Error/Error";
import postRequest from "../../lib/postRequest";

const NewClientList = ({ clients }) => {
	const [newUser, setNewUser] = useState(null);
	const [newClient, setNewClient] = useState(null);
	const [error, setError] = useState(null);

	const registerClient = (id) => {
		const data = {
			new_client_id: id,
		};

		const register = async () => {
			const [response, error] = await postRequest("client/new/process", data);
			if (error) {
				console.error("Error: ", error);
				setError(error);
			} else {
				setNewClient(response.client);
				setNewUser(response.user);
			}
		};
		register();
	};

	if (error) {
		return <Error error={error} />;
	}

	if (newClient && newUser) {
		return (
			<Container>
				<h4>Client Registered</h4>
				<p>
					{newClient.c_name} has been registered with {newUser.name} (
					{newUser.email}) as the primary contact.
				</p>
				<h4>Login Details</h4>
				<p>
					An email has been sent to {newUser.email} with their login details.
				</p>
				<p>username: {newUser.email}</p>
				<p>password: {newUser.password}</p>
				<Button
					onClick={() => {
						window.location.reload(); // Reload the webpage
					}}
				>
					Close
				</Button>
			</Container>
		);
	}

	if (clients && clients.length === 0) {
		return <Container>No pending clients found</Container>;
	}

	return (
		<Container>
			{clients && clients.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Status</th>
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
									<td>{client.status}</td>
									<td>{client.c_name}</td>
									<td>{client.c_type}</td>
									<td>
										{client.name}
										<br />({client.email})
									</td>
									<td>{client.licenses}</td>
									<td>{client.quoteRef}</td>
									<td>{new Date(client.updated_at).toLocaleString()}</td>
									<td>
										{client.status === "pending" && client.userExists && (
											<ButtonGroup>
												<Button variant="warning" size="sm" disabled>
													Account Exists
												</Button>
											</ButtonGroup>
										)}
										{client.status === "pending" && !client.userExists && (
											<ButtonGroup>
												<Button
													variant="primary"
													size="sm"
													onClick={() => registerClient(client.id)}
												>
													Create Account
												</Button>
											</ButtonGroup>
										)}
										{client.status === "registered" && (
											<ButtonGroup>
												<Button variant="success" size="sm" disabled>
													Registered
												</Button>
											</ButtonGroup>
										)}
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
