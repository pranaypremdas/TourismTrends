import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [userCount, setUserCount] = useState("");

  // For now only logs to console need to impliment logic for adding to database
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      name,
      email,
      location,
      businessType,
      userCount,
    });
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Get A Quote / Contact Us</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>What Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBusinessType">
              <Form.Label>Gov / Private Business?</Form.Label>
              <Form.Select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="Gov">Government</option>
                <option value="Private">Private Business</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserCount">
              <Form.Label>How many users</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of users"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Contact;
