import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const LocalGovernmentAreas = ({ lgas }) => {
	return (
		<Container>
			{lgas && lgas.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>State</th>
						</tr>
					</thead>
					<tbody>
						{lgas &&
							lgas.map((lga) => (
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
