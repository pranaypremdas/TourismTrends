import React, { useContext } from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

// user context
import { UserContext } from "../../../contexts/UserContext";

const LocalGovernmentAreas = ({ lgas }) => {
	const { user } = useContext(UserContext);
	const validLgas = user.client.lgaIds
		.map((id) => lgas.find((lga) => lga.id === id))
		.filter(Boolean);

	return (
		<Container>
			{validLgas.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>State</th>
						</tr>
					</thead>
					<tbody>
						{validLgas.map((lga) => (
							<tr key={lga.id}>
								<td>{lga.id}</td>
								<td>{lga.lga_name}</td>
								<td>{lga.state}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default LocalGovernmentAreas;
