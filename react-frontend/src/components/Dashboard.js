import React, { useState, useEffect, useCallback } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Tab,
	Nav,
} from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "chartjs-adapter-date-fns";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Custom Components
import postRequest from "./lib/postRequest";
import Error from "./Error/Error";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale
);

const Dashboard = () => {
	const [rowData, setRowData] = useState([]);
	const [chartData, setChartData] = useState(null);
	const [startDate, setStartDate] = useState("2024-01-01");
	const [endDate, setEndDate] = useState("2024-01-31");
	const [startYear, setStartYear] = useState("2023");
	const [endYear, setEndYear] = useState("2024");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("customDates");
	const [metadata, setMetadata] = useState(null); // To store calculated statistics

	// const [filterState, setFilterState] = useState({
	// 	startDate: "2024-01-01",
	// 	endDate: "2024-01-31",
	// 	startYear: "2023",
	// 	endYear: "2024",
	// 	lgas: [],
	// 	trendType: "ave_historical_occupancy",
	// });

	// setFilterState(s => ({ ...s, startDate: filterState.startDate }));

	const [columnDefs] = useState([
		{ headerName: "Date", field: "date" },
		{ headerName: "LGA Name", field: "lga_name" },
		{ headerName: "Occupancy (%)", field: "ave_historical_occupancy" },
	]);

	const defaultColDef = {
		sortable: true,
		filter: true,
		resizable: true,
	};

	// Function to calculate statistics (max, min, average, count, standard deviation)
	const calculateStatistics = (data) => {
		const values = data.map((item) => item.ave_historical_occupancy);
		const count = values.length;
		const sum = values.reduce((acc, value) => acc + value, 0);
		const avg = sum / count;
		const min = Math.min(...values);
		const max = Math.max(...values);
		const stdDev = Math.sqrt(
			values.reduce((acc, value) => acc + Math.pow(value - avg, 2), 0) / count
		);

		return {
			count,
			avg,
			min,
			max,
			stdDev,
		};
	};
	const fetchData = async (isYearOnYear = false) => {
		setLoading(true);
		try {
			// Construct dates for custom or year-on-year selection
			const yearOnYearStartDate = `${startYear}-01-01`;
			const yearOnYearEndDate = `${endYear}-12-31`;

			const requestBody = isYearOnYear
				? {
						region: [1, 2, 3],
						dateRange: [yearOnYearStartDate, yearOnYearEndDate],
						type: ["ave_historical_occupancy"],
				  }
				: {
						region: [1, 2, 3],
						dateRange: [startDate, endDate],
						type: ["ave_historical_occupancy"],
				  };

			const [trendData, trendError] = await postRequest("trends", requestBody);

			if (trendError) {
				setError(trendError);
			} else {
				const mappedData = trendData.results.map((item) => ({
					date: item.date,
					lga_name: item.lga_name,
					ave_historical_occupancy: item.ave_historical_occupancy,
				}));

				setRowData(mappedData);

				// Calculate metadata
				const stats = calculateStatistics(mappedData);
				setMetadata(stats);

				// Prepare data for the chart
				const groupedData = mappedData.reduce((acc, item) => {
					if (!acc[item.lga_name]) {
						acc[item.lga_name] = [];
					}
					acc[item.lga_name].push({
						x: item.date,
						y: item.ave_historical_occupancy,
					});
					return acc;
				}, {});

				const datasets = Object.keys(groupedData).map((lga_name) => ({
					label: lga_name,
					data: groupedData[lga_name],
					fill: false,
					borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
				}));

				setChartData({
					datasets,
				});
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch data on initial load
	useEffect(() => {
		fetchData(activeTab === "yearOnYear");
	}, [activeTab]);

	// Display error message if error occurs
	if (error) {
		return <Error message={error} />;
	}

	return (
		<Container className="my-5">
			{/* Header and Navigation */}
			<Row className="mb-4">
				<Col>
					<h1 className="text-center">Tourism Data Insights for Queensland</h1>
					<p className="text-center">
						Utilize past tourism data to enhance strategic planning, resource
						allocation, and infrastructure development for better economic
						growth.
					</p>
				</Col>
			</Row>

			{/* Tabs for Custom and Year-on-Year */}
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
						{/* Custom Dates Form */}
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
						{/* Year-on-Year Form */}
						<Row>
							<Col>
								<Form>
									<Row>
										<Col>
											<Form.Group controlId="startYear">
												<Form.Label>Start Year</Form.Label>
												<Form.Control
													as="select"
													value={startYear}
													onChange={(e) => setStartYear(e.target.value)}
												>
													<option value="2022">2022</option>
													<option value="2023">2023</option>
												</Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group controlId="endYear">
												<Form.Label>End Year</Form.Label>
												<Form.Control
													as="select"
													value={endYear}
													onChange={(e) => setEndYear(e.target.value)}
												>
													<option value="2023">2023</option>
													<option value="2024">2024</option>
												</Form.Control>
											</Form.Group>
										</Col>
										<Col className="d-flex align-items-end">
											<Button
												variant="primary"
												onClick={() => fetchData(true)}
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
				</Tab.Content>
			</Tab.Container>

			{/* Metadata Display */}
			{metadata && (
				<Row className="my-4">
					<Col>
						<Card>
							<Card.Header>Summary Statistics</Card.Header>
							<Card.Body>
								<p>Average: {metadata.avg.toFixed(2)}</p>
								<p>Max: {metadata.max}</p>
								<p>Min: {metadata.min}</p>
								<p>Standard Deviation: {metadata.stdDev.toFixed(2)}</p>
								<p>Count: {metadata.count}</p>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{/* Chart */}
			{chartData && (
				<Row className="mb-4">
					<Col>
						<Card>
							<Card.Header>Occupancy Trends</Card.Header>
							<Card.Body>
								<Line data={chartData} />
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{/* AgGrid Table */}
			<Row>
				<Col>
					<div
						className="ag-theme-alpine"
						style={{ height: 400, width: "100%" }}
					>
						<AgGridReact
							rowData={rowData}
							columnDefs={columnDefs}
							defaultColDef={defaultColDef}
							pagination
						/>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
