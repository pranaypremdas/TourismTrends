import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Tourism Trends. All rights
              reserved.
            </p>
            <div>
              <a href="#privacy" className="text-light">
                Privacy Policy
              </a>{" "}
              |
              <a href="#terms" className="text-light ml-2">
                Terms of Service
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
