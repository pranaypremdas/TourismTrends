import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
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
  // TODO need to find a way to retrieve the token rather than copy pasting it
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzI3NzU2NjAsImlhdCI6MTczMjY4OTI2MCwidXNlciI6eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0b3VyaXNtdHJlbmRzLmNvbSIsInJvbGUiOiJhZG1pbiIsImNsaWVudF9pZCI6IjEiLCJjbGllbnRfbmFtZSI6IlRvdXJpc20gVHJlbmRzIiwiY2xpZW50X3R5cGUiOiJvd25lciJ9fQ.EoGklaLvi1JLJyVkQVP-jba7-ek5syzAQawWvm_bFCQ";

        const requestBody = {
          region: [1, 2, 3],
          dateRange: ["2024-01-01", "2024-01-31"],
          type: ["ave_historical_occupancy"],
        };

        const response = await axios.post(
          "https://localhost:5000/trends",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mappedData = response.data.results.map((item) => ({
          date: item.date,
          lga_name: item.lga_name,
          ave_historical_occupancy: item.ave_historical_occupancy,
        }));

        setRowData(mappedData);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="my-5">
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
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Occupancy Trends Over Time</Card.Title>
              {chartData && (
                <Line
                  data={{
                    labels: rowData.map((item) => item.date),
                    datasets: chartData.datasets,
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Average Historical Occupancy Rate",
                      },
                    },
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          unit: "day",
                        },
                        min: "2024-01-01",
                        max: "2024-01-31",
                      },
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Occupancy Data</Card.Title>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
