import React from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

// Custom Components
import RegisterUser from "./users/RegisterUser";
import UserList from "./users/UserList";

const ManageUsers = () => {
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
								<UserList />
							</div>
						</Tab>
						<Tab eventKey="registerNewUser" title="Register New User">
							<div className="mt-3">
								<h3>Register New User</h3>
								<RegisterUser />
							</div>
						</Tab>
					</Tabs>
				</Col>
			</Row>
		</Container>
	);
};

export default ManageUsers;
