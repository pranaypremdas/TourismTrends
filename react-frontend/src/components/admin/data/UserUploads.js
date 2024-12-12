import React from "react";

// Bootstrap Components
import { Container, Table } from "react-bootstrap";

const UserUploads = ({ uploads, trendTypes }) => {
	return (
		<Container>
			{uploads.length > 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Trend Types</th>
							<th>Created At</th>
						</tr>
					</thead>
					<tbody>
						{uploads.map((upload) => (
							<tr key={upload.id}>
								<td>{upload.id}</td>
								<td>{upload.name}</td>
								<td>{new Date(upload.start_date).toLocaleDateString()}</td>
								<td>{new Date(upload.end_date).toLocaleDateString()}</td>
								<td>
									<ul>
										{upload.tt_ids.split(",").map((id) => {
											let tt = trendTypes.find((tt) => tt.id === Number(id));
											return <li key={id}>{tt.name}, </li>;
										})}
									</ul>
								</td>
								<td>{new Date(upload.created_at).toLocaleDateString()}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};

export default UserUploads;
