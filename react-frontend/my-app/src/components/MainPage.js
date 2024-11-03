import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const MainPage = () => {
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
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Analyze Local Tourism Trends</Card.Title>
              <Card.Text>
                Access past and current data to identify trends and make
                informed decisions for the region. Compare with state averages
                and other local government areas.
              </Card.Text>
              <Button variant="primary" href="/dashboard">
                View Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Get A Quote / Contact Us</Card.Title>
              <Card.Text>
                Reach out for insights and tailored solutions for your region's
                tourism data analysis and planning needs.
              </Card.Text>
              <Button variant="primary" href="/quote">
                Get A Quote
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Upload and Compare Data</Card.Title>
              <Card.Text>
                Upload your own tourism data to compare with regional trends and
                state averages for comprehensive analysis.
              </Card.Text>
              <Button variant="primary" href="/upload">
                Upload Data
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Download Reports</Card.Title>
              <Card.Text>
                Access and download analysis reports for strategic presentations
                and decision-making. Available for government agencies and
                stakeholders.
              </Card.Text>
              <Button variant="primary" href="/reports">
                Download Reports
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3 className="text-center">Why Use Our Platform?</h3>
          <ul className="list-unstyled text-center">
            <li>
              ✔ Compare year-on-year trends to allocate resources effectively.
            </li>
            <li>
              ✔ Analyze local data to organize infrastructure, zoning, and
              events.
            </li>
            <li>
              ✔ Make data-driven decisions for business and event planning.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
