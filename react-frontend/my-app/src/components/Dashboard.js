import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Dashboard = () => {
  const [rowData] = useState([
    { year: 2020, occupancy: 75, avgRate: 150 },
    { year: 2021, occupancy: 80, avgRate: 160 },
    { year: 2022, occupancy: 85, avgRate: 170 },
    { year: 2023, occupancy: 90, avgRate: 180 },
  ]);

  const [columnDefs] = useState([
    { headerName: "Year", field: "year" },
    { headerName: "Occupancy (%)", field: "occupancy" },
    { headerName: "Average Daily Rate ($)", field: "avgRate" },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

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
              <Card.Title>Yearly Occupancy and Average Daily Rate</Card.Title>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%" }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  enableCharts={true}
                  popupParent={document.body}
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
