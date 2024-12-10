import React, { useState } from "react";

// Bootstrap Components
import { Container, Table, Form, Button, Card, Alert } from "react-bootstrap";

// postRequest
import postRequest from "../../lib/postRequest";

const TrendTypes = ({ trendTypes, setTrendTypes }) => {
	const [newTrendType, setNewTrendType] = useState({
		name: "",
		description: "",
	});
	const [state, setState] = useState({
		error: null,
		message: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewTrendType((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState((s) => ({ error: null, message: null }));

		let [response, error] = await postRequest("trend/types/add", {
			newType: newTrendType,
		});

		if (error) {
			setState((s) => ({ error: error.message }));
			return;
		} else {
			setTrendTypes(response.results);
		}

		setNewTrendType({ name: "", description: "" });
	};

	return (
		<>
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				{state.message && <Alert variant="success">{state.message}</Alert>}
				{state.error && <Alert variant="danger">{state.error}</Alert>}
				{trendTypes && trendTypes.length > 0 && (
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Id</th>
								<th>Name</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{trendTypes.map((tt) => (
								<tr key={tt.id}>
									<td>{tt.id}</td>
									<td>{tt.name}</td>
									<td>{tt.description}</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Container>
			<Container className="d-flex justify-content-center align-items-top mt-4 mb-4">
				<Card className="p-4">
					<Card.Title className="text-center">
						<h5>Add Trend Type</h5>
					</Card.Title>
					<Card.Body>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="formTrendTypeName">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									name="name"
									value={newTrendType.name}
									onChange={handleChange}
									required
								/>
							</Form.Group>
							<Form.Group controlId="formTrendTypeDescription">
								<Form.Label>Description</Form.Label>
								<Form.Control
									type="text"
									name="description"
									value={newTrendType.description}
									onChange={handleChange}
									required
								/>
							</Form.Group>
							<div className="d-flex justify-content-between mt-2">
								<Button
									variant="warning"
									type="reset"
									onClick={() => setNewTrendType({ name: "", description: "" })}
								>
									Reset
								</Button>
								<Button variant="primary" type="submit">
									Add Trend Type
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		</>
	);
};

export default TrendTypes;
