import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const UserList = ({ users }) => {
	return (
		<Container>
			{users && users.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Email</th>
							<th>Role</th>
							<th>Client Name</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{users &&
							users.map((user) => (
								<tr key={user.id}>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>{user.client_name}</td>
									<td>{new Date(user.updated_at).toLocaleString()}</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default UserList;
