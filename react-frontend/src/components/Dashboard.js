import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Tab, Nav } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import { UserContext } from "../contexts/UserContext";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import postRequest from "./lib/postRequest";
import getRequest from "./lib/getRequest";
import Error from "./Error/Error";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const calculateMetadata = (data, key) => {
	const values = data.map((item) => item[key]).filter((v) => v != null);
	if (!values.length) return null;

	const sum = values.reduce((a, b) => a + b, 0);
	const mean = sum / values.length;
	const min = Math.min(...values);
	const max = Math.max(...values);
	const variance =
		values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
	const stdDev = Math.sqrt(variance);

	return { min, max, mean, stdDev };
};

const Dashboard = () => {
	const { user } = useContext(UserContext);
	const [rowData, setRowData] = useState([]);
	const [chartData, setChartData] = useState(null);
	const [startDate, setStartDate] = useState("2024-01-01");

	// form state
	const [endDate, setEndDate] = useState("2024-01-31");
	const [startYear, setStartYear] = useState("2023");
	const [endYear, setEndYear] = useState("2024");
	const [selectedTrendType, setSelectedTrendType] = useState("1");
	const [selectedRegion, setSelectedRegion] = useState("");

	// data state
	const [trendTypes, setTrendTypes] = useState([]);
	const [lgas, setLgas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("customDates");
	const [dataViewTab, setDataViewTab] = useState("graph");
	const [metadata, setMetadata] = useState(null);

	const [columnDefs] = useState([
		{ headerName: "Date", field: "date" },
		{ headerName: "LGA Name", field: "lga_name" },
		{ headerName: "Value", field: selectedTrendType },
	]);

	const defaultColDef = {
		sortable: true,
		filter: true,
		resizable: true,
	};

	// fetch data from the server
	const fetchData = async (isYearOnYear = false) => {
		setLoading(true);
		try {
			const yearOnYearStartDate = `${startYear}-01-01`;
			const yearOnYearEndDate = `${endYear}-12-31`;

			const requestBody = isYearOnYear
				? {
						dateRange: [yearOnYearStartDate, yearOnYearEndDate],
						type: [selectedTrendType],
				  }
				: {
						dateRange: [startDate, endDate],
						type: [selectedTrendType],
				  };

			const [trendData, trendError] = await postRequest("trends", requestBody);
			// const [userTrendData, userTrendError] = await postRequest(
			// 	"trends/user/get",
			// 	requestBody
			// );

			if (trendError) {
				setError(trendError.message);
				return;
			}
			// else if (userTrendError) {
			// 	setError(userTrendError);
			// }
			else {
				const mappedData = trendData.results.map((item) => ({
					date: item.date,
					lga_name: item.lga_name,
					[selectedTrendType]: item.value,
				}));

				setRowData(mappedData);

				if (isYearOnYear) {
					// Process data for year-on-year visualization
					const groupedByYear = {};
					mappedData.forEach((item) => {
						const [year, month, day] = item.date.split("-");
						const key = `${month}-${day}`; // Align by month and day
						if (month !== "2" && day !== "29") {
							if (!groupedByYear[year]) groupedByYear[year] = {};
							if (!groupedByYear[year][key]) groupedByYear[year][key] = 0;
							groupedByYear[year][key] += item[selectedTrendType];
						}
					});

					const datasets = Object.entries(groupedByYear).map(
						([year, data]) => ({
							label: `Year ${year}`,
							data: Object.entries(data).map(([date, value]) => ({
								x: date,
								y: value,
							})),
							fill: false,
							borderColor: `#${Math.floor(Math.random() * 16777215).toString(
								16
							)}`,
						})
					);

					setChartData({
						datasets,
					});
				} else {
					// Original chart processing for custom date range
					const groupedData = mappedData.reduce((acc, item) => {
						if (!acc[item.lga_name]) {
							acc[item.lga_name] = [];
						}
						acc[item.lga_name].push({
							x: item.date,
							y: item[selectedTrendType],
						});
						return acc;
					}, {});

					const datasets = Object.keys(groupedData).map((lga_name) => ({
						label: lga_name,
						data: groupedData[lga_name],
						fill: false,
						borderColor: `#${Math.floor(Math.random() * 16777215).toString(
							16
						)}`,
					}));

					setChartData({
						datasets,
					});
				}

				const calculatedMetadata = calculateMetadata(
					mappedData,
					selectedTrendType
				);
				setMetadata(calculatedMetadata);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	// fetch LGAs on initial load
	useEffect(() => {
		async function fetchInitialData() {
			const [lgaList, lgaError] = await getRequest("lga/list", false);
			const [trendTypesList, trendTypesError] = await getRequest("trend/types");
			if (lgaError) {
				setError(lgaError);
			} else if (trendTypesError) {
				setError(trendTypesError);
			} else {
				setLgas(lgaList.results);
				setTrendTypes(trendTypesList.results);
			}
		}
		fetchInitialData();
	}, []);

	// get data on initial load
	useEffect(() => {
		if (trendTypes.length > 0 && lgas.length > 0) {
			fetchData(activeTab === "yearOnYear");
		}
	}, [trendTypes, lgas, activeTab, selectedTrendType, selectedRegion]);

	if (error) {
		return <Error error={error} />;
	}

	return (
		<Container className="my-5">
			<Row className="mb-4">
				<Col>
					<h1 className="text-center">Tourism Data Insights for Queensland</h1>
				</Col>
			</Row>
			<Form.Group controlId="selectedSeleselectedTrendType" className="mb-4">
				<Form.Label>Select Data Type</Form.Label>
				<Form.Control
					as="select"
					value={selectedTrendType}
					onChange={(e) => setSelectedTrendType(e.target.value)}
				>
					{trendTypes.map((type) => (
						<option key={type.id} value={type.id}>
							{type.name}
						</option>
					))}
				</Form.Control>
			</Form.Group>

			<Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
				<Nav variant="tabs" className="mb-4">
					<Nav.Item>
						<Nav.Link eventKey="customDates">Custom Dates</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="yearOnYear">Year-on-Year</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Content>
					<Tab.Pane eventKey="customDates">
						<Row>
							<Col>
								<Form>
									<Row>
										<Col>
											<Form.Group controlId="startDate">
												<Form.Label>Start Date</Form.Label>
												<Form.Control
													type="date"
													value={startDate}
													onChange={(e) => setStartDate(e.target.value)}
												/>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group controlId="endDate">
												<Form.Label>End Date</Form.Label>
												<Form.Control
													type="date"
													value={endDate}
													onChange={(e) => setEndDate(e.target.value)}
												/>
											</Form.Group>
										</Col>
										<Col className="d-flex align-items-end">
											<Button
												variant="primary"
												onClick={() => fetchData(false)}
												disabled={loading}
											>
												{loading ? "Loading..." : "Search"}
											</Button>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</Tab.Pane>
					<Tab.Pane eventKey="yearOnYear">
						<Row>
							<Col>
								<Form>
									<Row>
										<Col>
											<Form.Group controlId="regionDropdown">
												<Form.Label>Select Region</Form.Label>
												<Form.Control
													as="select"
													value={selectedRegion}
													onChange={(e) => setSelectedRegion(e.target.value)}
												>
													{user.client.lgaIds &&
													user.client.lgaIds.length > 0 ? (
														user.client.lgaIds.map((id) => {
															const lga = lgas.find((lga) => lga.id === id);
															return (
																<option key={id} value={id}>
																	{lga ? lga.lga_name : "Unknown"}
																</option>
															);
														})
													) : (
														<option disabled>No regions available</option>
													)}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>

			<Tab.Container
				activeKey={dataViewTab}
				onSelect={(k) => setDataViewTab(k)}
			>
				<Nav variant="tabs" className="mb-4 mt-4">
					<Nav.Item>
						<Nav.Link eventKey="graph">Graph</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="table">Table</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Content>
					<Tab.Pane eventKey="graph">
						{chartData && (
							<Line
								data={chartData}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "top",
										},
									},
								}}
							/>
						)}
					</Tab.Pane>
					<Tab.Pane eventKey="table">
						<div
							className="ag-theme-alpine"
							style={{ height: 500, width: "100%" }}
						>
							<AgGridReact
								rowData={rowData}
								columnDefs={columnDefs}
								defaultColDef={defaultColDef}
								pagination={true}
							/>
						</div>
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>

			{metadata && (
				<div className="mt-4">
					<h5>Metadata:</h5>
					<div className="card">
						<div className="card-body">
							<div className="row text-center">
								<div className="col-md-3">
									<h6>Minimum</h6>
									<p className="text-primary">{metadata.min}</p>
								</div>
								<div className="col-md-3">
									<h6>Maximum</h6>
									<p className="text-primary">{metadata.max}</p>
								</div>
								<div className="col-md-3">
									<h6>Average</h6>
									<p className="text-primary">{metadata.mean.toFixed(2)}</p>
								</div>
								<div className="col-md-3">
									<h6>Standard Deviation</h6>
									<p className="text-primary">{metadata.stdDev.toFixed(2)}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Container>
	);
};

export default Dashboard;
