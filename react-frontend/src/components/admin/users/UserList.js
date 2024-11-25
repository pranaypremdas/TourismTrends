import React, { useEffect, useState } from "react";

// Bootstrap Components
import { Container, Alert, Table } from "react-bootstrap";

// Custom Components
import getRequest from "../../lib/getRequest";

const RegisterUser = () => {
	const [results, setResults] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [userList, userError] = await getRequest("user/list");
			const [clientList, clientError] = await getRequest("client/list");

			if (userError || clientError) {
				userError ? setError(userError) : setError(clientError);
			} else {
				let users = userList.results.map((user) => ({
					...user,
					client_name: clientList.results.find(
						(client) => client.id === user.client_id
					)[0].c_name,
				}));

				setResults(users);
			}

			setLoading(false);
		};
		getUsers();
	}, []);

	console.log(results);

	return (
		<Container>
			{loading && <p>Loading...</p>}
			{results && results.length === 0 && <p>No users found.</p>}
			{results && results.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Email</th>
							<th>Role</th>
							<th>Client Name</th>
							<th>Client Type</th>
							<th>Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{results &&
							results.map((user) => (
								<tr key={user.id}>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>{user.client_name}</td>
									<td>{user.client_type}</td>
									<td>{new Date(user.updated_at).toLocaleString()}</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}

			{error && (
				<Alert variant="danger" className="mt-3">
					{error}
				</Alert>
			)}
		</Container>
	);
};

export default RegisterUser;
