import React, { useState, useEffect } from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab, Alert } from "react-bootstrap";

// Custom Components
import RegisterUser from "./users/RegisterUser";
import UserList from "./users/UserList";
import Loading from "../Loading";

// Custom Components
import getRequest from "../lib/getRequest";

const ManageUsers = () => {
	const [users, setUsers] = useState(null);
	const [clients, setClients] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [userList, userError] = await getRequest("user/list");
			const [clientList, clientError] = await getRequest("client/list");

			if (userError || clientError) {
				setError(userError ? userError.message : clientError.message);
			} else {
				const users = userList.results.map((user) => {
					const client = clientList.results.find(
						(client) => client.id.toString() === user.client_id
					);
					return {
						...user,
						client_name: client ? client.c_name : "Unknown",
					};
				});
				setUsers(users);
				setClients(clientList.results);
			}

			setLoading(false);
		};
		getUsers();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<Container>
			<Row>
				<Col>
					<h2>Manage Users</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<Tabs defaultActiveKey="clientDetails" id="manage-users-tabs">
						<Tab eventKey="userList" title="User List">
							<div className="mt-3">
								<h3>User List</h3>
								<UserList users={users} />
							</div>
						</Tab>
						<Tab eventKey="registerNewUser" title="Register New User">
							<div className="mt-3">
								<h3>Register New User</h3>
								<RegisterUser clients={clients} />
							</div>
						</Tab>
					</Tabs>
				</Col>
			</Row>
			{error && (
				<Alert variant="danger" className="mt-3">
					{error}
				</Alert>
			)}
		</Container>
	);
};

export default ManageUsers;
