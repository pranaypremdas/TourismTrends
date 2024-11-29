import React, { useState, useEffect, useContext } from "react";

// Bootstrap Components
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

// Custom Components
import Loading from "../../Loading";
import Error from "../../Error/Error";

// Custom Components
import getRequest from "../../lib/getRequest";
import { UserContext } from "../../../contexts/UserContext";
import LocalGovernmentAreas from "./LocalGovernmentAreas";

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
 *
 */
const ManageData = () => {
	const { user } = useContext(UserContext);
	const [lgas, setLgas] = useState([]);
	const [trendTypes, setTrendTypes] = useState({public: [], user: []});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [lgaList, lgaError] = await getRequest("lga/list", false);
			const [trendTypes, trendTypesError] = await getRequest("trends/types");

			if (lgaError) {
				setError(lgaError.message);
			} else if (trendTypesError) {
				setError(trendTypesError.message);
			} else {
				setLgas(lgaList.results);
				setTrendTypes(trendTypes.results);
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
						<Tab eventKey="lgas" title="LGAs Covered">
							<div className="mt-3">
								<h3>Local Government Areas</h3>
								<LocalGovernmentAreas lgas={lgas} />
							</div>
						</Tab>

						{user.role === "admin" && (
							<Tab eventKey="dataType" title="Data Types">
								<div className="mt-3">
									<h3>Data Types</h3>
									{trendTypes && trendTypes.public.length > 0 && (
										<ul>
											{trendTypes.public.map((type) => (
												<li key={"key_" + type.id}>{type.name}</li>
											))}
										</ul>
									)}
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
