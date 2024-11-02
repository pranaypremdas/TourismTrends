import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const MainPage = () => {
  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h2>Welcome to Your Next Adventure!</h2>
          <p>
            Discover popular tourist spots, plan your trips, and explore new
            destinations with ease.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Top Destinations</Card.Title>
              <Card.Text>
                Explore places like Gold Coast, Noosa, Whitsunday, and Cairns.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Plan Your Stay</Card.Title>
              <Card.Text>
                Check out accommodations and plan your trip with local insights.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
