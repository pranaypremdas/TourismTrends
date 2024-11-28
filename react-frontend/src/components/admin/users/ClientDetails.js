import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

/**
 * Component to display details of a single client in a table format.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.clients - Array containing client details.
 * @param {Object} props.clients[0] - The client object.
 * @param {string} props.clients[0].c_name - The name of the client.
 * @param {string} props.clients[0].c_type - The type of the client.
 * @param {string} props.clients[0].domain - The domain of the client.
 * @param {number} props.clients[0].user_count - The number of users associated with the client.
 * @param {number} props.clients[0].licenses - The number of licenses the client has.
 * @param {string} props.clients[0].updated_at - The last updated timestamp of the client details.
 * @param {string} props.clients[0].expires_at - The subscription expiry timestamp of the client.
 * @returns {JSX.Element} The rendered component.
 */
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
									<td>Subscription Expires At</td>
									<td>
										{new Date(clients[0].expires_at).toLocaleDateString()}
									</td>
								</tr>
								<tr>
									<td>Last Updated</td>
									<td>
										{new Date(clients[0].updated_at).toLocaleDateString()}
									</td>
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
