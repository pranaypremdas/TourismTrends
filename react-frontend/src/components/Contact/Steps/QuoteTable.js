import React from "react";

// Bootstrap Components
import { Table } from "react-bootstrap";

// Custom Components
import userPricing from "./userPricing";

/**
 * QuoteTable component displays a table with the quote details for a new client.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.newClient - The new client details.
 * @param {string} props.newClient.clientType - The type of client membership.
 * @param {Array<number>} props.newClient.lgaIds - The list of location IDs.
 * @param {number} props.newClient.licenses - The number of licenses.
 * @param {string} [props.newClient.message] - An optional message from the client.
 * @param {Object} props.state - The state details.
 * @param {Array<Object>} props.state.lgas - The list of locations.
 * @param {Object} props.state.price - The price details.
 * @param {number} props.state.price.type - The price for the membership type.
 * @param {number} props.state.price.locations - The price for the locations.
 * @param {number} props.state.price.users - The price for the users.
 *
 * @returns {JSX.Element} The rendered QuoteTable component.
 */
const QuoteTable = ({ newClient, state }) => {
	const { clientType, lgaIds, licenses, message } = newClient;
	const { lgas, price } = state;
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
						<td>{clientType}</td>
						<td>${price.type}</td>
					</tr>
					<tr>
						<td>Locations</td>
						<td>
							{lgaIds.map((location, index) => {
								if (index === lgaIds.length - 1) {
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
							{licenses} * ${userPricing[licenses]} / year
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
