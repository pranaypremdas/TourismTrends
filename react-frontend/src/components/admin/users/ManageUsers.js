import React, { useState, useEffect, useContext } from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab, Alert } from "react-bootstrap";

// Custom Components
import CreateUser from "./CreateUser";
import UserList from "./UserList";
import ClientList from "./ClientList";
import ClientDetails from "./ClientDetails";
import Loading from "../../Loading";

// Custom Components
import getRequest from "../../lib/getRequest";
import { UserContext } from "../../../contexts/UserContext";

const ManageUsers = () => {
	const { user } = useContext(UserContext);
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
				const clients = clientList.results.map((client) => {
					return {
						...client,
						user_count: users.filter(
							(user) => user.client_id === client.id.toString()
						).length,
					};
				});

				setUsers(users);
				setClients(clients);
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
						{user.role === "admin" && (
							<Tab eventKey="clientList" title="Client List">
								<div className="mt-3">
									<h3>Client List</h3>
									<ClientList clients={clients} />
								</div>
							</Tab>
						)}
						{user.role === "client_admin" && (
							<Tab eventKey="clientDetails" title="Client Details">
								<div className="mt-3">
									<h3>Client Details</h3>
									<ClientDetails clients={clients} />
								</div>
							</Tab>
						)}
						<Tab eventKey="userList" title="User List">
							<div className="mt-3">
								<h3>User List</h3>
								<UserList users={users} />
							</div>
						</Tab>
						<Tab eventKey="createNewUser" title="Register New User">
							<div className="mt-3">
								<h3>Create New User</h3>
								<CreateUser clients={clients} />
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
