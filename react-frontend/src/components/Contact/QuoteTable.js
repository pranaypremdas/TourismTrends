import React from "react";

// Bootstrap Components
import { Table } from "react-bootstrap";

// Custom Components
import userPricing from "./userPricing";

const QuoteTable = ({ quotes }) => {
	const { businessType, locations, userCount, price, message, lgas } = quotes;
	return (
		<>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Option</th>
						<th>Selection</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Membership Type</td>
						<td>{businessType}</td>
						<td>${price.type}</td>
					</tr>
					<tr>
						<td>Locations</td>
						<td>
							{locations.map((location, index) => {
								if (index === locations.length - 1) {
									return `${lgas[Number.parseInt(location) - 1].lga_name}`;
								}
								return `${lgas[Number.parseInt(location) - 1].lga_name}, `;
							})}
						</td>
						<td>${price.locations}</td>
					</tr>
					<tr>
						<td>Users</td>
						<td>
							{userCount} * ${userPricing[userCount]} / year
						</td>
						<td>${price.users}</td>
					</tr>
					<tr>
						<td>Yearly Subscription</td>
						<td></td>
						<td>${price.type + price.locations + price.users}</td>
					</tr>
				</tbody>
			</Table>
			<br />
			{message && <>Message: {message}</>}
		</>
	);
};

export default QuoteTable;
