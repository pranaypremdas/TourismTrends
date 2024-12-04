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

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [rowData, setRowData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");
  const [startYear, setStartYear] = useState("2023");
  const [endYear, setEndYear] = useState("2024");
  const [trendType, setTrendType] = useState("ave_historical_occupancy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("customDates");
  const [dataViewTab, setDataViewTab] = useState("graph");

  const [columnDefs] = useState([
    { headerName: "Date", field: "date" },
    { headerName: "LGA Name", field: "lga_name" },
    { headerName: "Value", field: trendType },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const fetchData = async (isYearOnYear = false) => {
    setLoading(true);
    try {
      const yearOnYearStartDate = `${startYear}-01-01`;
      const yearOnYearEndDate = `${endYear}-12-31`;
      const requestBody = isYearOnYear
        ? {
            region: user.client.lgaIds,
            dateRange: [yearOnYearStartDate, yearOnYearEndDate],
            type: [trendType],
          }
        : {
            region: user.client.lgaIds,
            dateRange: [startDate, endDate],
            type: [trendType],
          };

      const [trendData, trendError] = await postRequest("trends", requestBody);

      if (trendError) {
        setError(trendError);
      } else {
        const mappedData = trendData.results.map((item) => ({
          date: item.date,
          lga_name: item.lga_name,
          [trendType]: item[trendType],
        }));

        setRowData(mappedData);

        const groupedData = mappedData.reduce((acc, item) => {
          if (!acc[item.lga_name]) {
            acc[item.lga_name] = [];
          }
          acc[item.lga_name].push({
            x: item.date,
            y: item[trendType],
          });
          return acc;
        }, {});

        const datasets = Object.keys(groupedData).map((lga_name) => ({
          label: lga_name,
          data: groupedData[lga_name],
          fill: false,
          borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
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

  useEffect(() => {
    fetchData(activeTab === "yearOnYear");
  }, [activeTab, trendType]);

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Tourism Data Insights for Queensland</h1>
        </Col>
      </Row>
      <Form.Group controlId="trendType" className="mb-4">
        <Form.Label>Select Data Type</Form.Label>
        <Form.Control
          as="select"
          value={trendType}
          onChange={(e) => setTrendType(e.target.value)}
        >
          <option value="ave_historical_occupancy">
            Average Historical Occupancy
          </option>
          <option value="ave_daily_rate">Average Daily Rate</option>
          <option value="ave_length_of_stay">Average Length of Stay</option>
          <option value="ave_booking_window">Average Booking Window</option>
        </Form.Control>
      </Form.Group>

      {/* Main Tabs */}
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

      {/* Nested Tabs for Data View */}
      <Tab.Container
        activeKey={dataViewTab}
        onSelect={(k) => setDataViewTab(k)}
      >
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="graph">Graph</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="table">Table</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="table">
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
                  />
                </div>
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey="graph">
            {/* Chart */}
            <Row>
              <Col>
                {chartData ? (
                  <Line data={chartData} />
                ) : (
                  <p>No data available for chart.</p>
                )}
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;
