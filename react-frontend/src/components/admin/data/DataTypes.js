import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const DataTypes = ({ trendTypes }) => {
	return (
		<Container>
			{trendTypes && trendTypes.public.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{trendTypes &&
							trendTypes.public.map((tt) => (
								<tr key={tt.id}>
									<td>{tt.id}</td>
									<td>{tt.name}</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default DataTypes;
