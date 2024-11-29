import React, { useState, useEffect, useContext } from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

// Custom Components
import Loading from "../../Loading";
import Error from "../../Error/Error";

// Custom Components
import getRequest from "../../lib/getRequest";
import { UserContext } from "../../../contexts/UserContext";

/**
 * ManageData component fetches and displays users and clients information.
 * It provides different views and functionalities based on the user's role.
 *
 * @component
 * @example
 * return (
 *   <ManageData />
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
const ManageData = () => {
	const { user } = useContext(UserContext);
	
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [lgaList, lgaError] = await getRequest("lga/list");

			if (lgaError) {
				setError(lgaError.message);
			} else {
				

				
			}

			setLoading(false);
		};
		getUsers();
	}, [user.role]);

	if (loading) {
		return <Loading />;
	}

	return (
		<Container>
			<Row>
				<Col>
					<h2>Manage Data</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<Tabs defaultActiveKey="data" id="manage-data-tabs">
						{user.role === "admin" && (
							<Tab eventKey="dataType" title="Data Types">
								<div className="mt-3">
									<h3>Data Types</h3>
								</div>
							</Tab>
						)}

						{user.role === "client_admin" && (
							<Tab eventKey="clientData" title="Your Data">
								<div className="mt-3">
									<h3>Your Data</h3>
								</div>
							</Tab>
						)}
						<Tab eventKey="uploadData" title="Upload Data">
							<div className="mt-3">
								<h3>Upload Data</h3>
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

export default ManageData;
