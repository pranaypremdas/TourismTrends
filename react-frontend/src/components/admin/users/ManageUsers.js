import React, { useState, useEffect, useContext } from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

// Custom Components
import CreateUser from "./CreateUser";
import UserList from "./UserList";
import ClientList from "./ClientList";
import ClientDetails from "./ClientDetails";
import NewClientList from "./NewClientList";
import Loading from "../../Loading";
import Error from "../../Error/Error";

// Custom Components
import getRequest from "../../lib/getRequest";
import { UserContext } from "../../../contexts/UserContext";

/**
 * ManageUsers component fetches and displays users and clients information.
 * It provides different views and functionalities based on the user's role.
 *
 * @component
 * @example
 * return (
 *   <ManageUsers />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * - Fetches user, client, and new client lists from the server.
 * - Displays loading indicator while fetching data.
 * - Handles and displays errors if any occur during data fetching.
 * - Renders different tabs and components based on the user's role:
 *   - Admin: Can view clients, pending clients, user list, and create new users.
 *   - Client Admin: Can view client details, user list and create new users.
 * - Uses context to get the current user information.
 */
const ManageUsers = () => {
	const { user } = useContext(UserContext);
	const [users, setUsers] = useState(null);
	const [clients, setClients] = useState(null);
	const [newClients, setNewClients] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [maxUsers, setMaxUsers] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [userList, userError] = await getRequest("user/list");
			const [clientList, clientError] = await getRequest("client/list");
			const [newClientList, newClientError] =
				user.role === "client_admin"
					? [{ results: [] }, null]
					: await getRequest("client/new/list");

			if (userError) {
				setError(userError);
			} else if (clientError) {
				setError(clientError);
			} else if (newClientError) {
				setError(newClientError);
			} else {
				let thisClient = clientList.results.find(
					(client) => client.id === user.client_id
				);
				const users = userList.results.map((user) => {
					return {
						...user,
						client_name: thisClient ? thisClient.c_name : "Unknown",
					};
				});
				const clients = clientList.results.map((client) => {
					return {
						...client,
						user_count: users.filter((user) => user.client_id === client.id)
							.length,
					};
				});
				const newClients = newClientList.results.map((client) => {
					return {
						...client,
						userExists: users.some((user) => user.email === client.email),
					};
				});

				thisClient = clients.find((client) => client.id === user.client_id);

				if (thisClient.user_count >= thisClient.licenses) {
					setMaxUsers(true);
				}

				if (user.role === "admin") {
					setMaxUsers(false);
				}

				setUsers(users);
				setClients(clients);
				setNewClients(newClients);
			}

			setLoading(false);
		};
		getUsers();
	}, [user.role, user.client_id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<Container>
			<Row>
				<Col>
					<h2>Manage Users/Clients</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<Tabs defaultActiveKey="clientDetails" id="manage-users-tabs">
						{user.role === "admin" && (
							<Tab eventKey="clientList" title="Clients">
								<div className="mt-3">
									<h3>Clients</h3>
									<ClientList clients={clients} />
								</div>
							</Tab>
						)}
						{user.role === "admin" && (
							<Tab eventKey="newClientList" title="Pending Clients">
								<div className="mt-3">
									<h3>Pending Clients</h3>
									<NewClientList clients={newClients} />
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
								<CreateUser
									clients={clients}
									setUsers={setUsers}
									maxUsers={maxUsers}
									setClients={setClients}
									setMaxUsers={setMaxUsers}
								/>
							</div>
						</Tab>
					</Tabs>
				</Col>
			</Row>

			{error && (
				<Row>
					<Col>
						<Error error={error} />
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default ManageUsers;
