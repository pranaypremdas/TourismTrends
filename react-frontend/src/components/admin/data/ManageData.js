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
import TrendTypes from "./TrendTypes";
import UploadData from "./UploadData";
import UserUploads from "./UserUploads";

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
	const [trendTypes, setTrendTypes] = useState([]);
	const [uploads, setUploads] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			setLoading(true);
			setError(null);

			const [lgaList, lgaError] = await getRequest("lga/list", false);
			const [trendTypes, trendTypesError] = await getRequest("trend/types");
			const [uploads, uploadsError] = await getRequest("trends/user/uploads");

			if (lgaError) {
				setError(lgaError);
			} else if (trendTypesError) {
				setError(trendTypesError);
			} else if (uploadsError) {
				setError(uploadsError);
			} else {
				setLgas(lgaList.results);
				setTrendTypes(trendTypes.results);
				setUploads(uploads.results);
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
						<Tab eventKey="lgas" title="Valid LGAs">
							<div className="mt-3">
								<h3>Valid Local Government Areas</h3>
								<LocalGovernmentAreas lgas={lgas} />
							</div>
						</Tab>

						<Tab eventKey="dataType" title="Valid Trend Types">
							<div className="mt-3">
								<h3>Valid Trend Types</h3>
								<TrendTypes
									trendTypes={trendTypes}
									setTrendTypes={setTrendTypes}
									user={user}
								/>
							</div>
						</Tab>

						<Tab eventKey="uploadData" title="Upload Data">
							<div className="mt-3">
								<h3>Upload Data</h3>
								<UploadData
									lgas={lgas}
									trendTypes={trendTypes}
									setUploads={setUploads}
								/>
							</div>
						</Tab>

						<Tab eventKey="existingData" title="Your Uploaded Data">
							<div className="mt-3">
								<h3>Your Uploaded Data</h3>
								<UserUploads
									uploads={uploads}
									trendTypes={trendTypes}
									// setUploads={setUploads}
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

export default ManageData;
