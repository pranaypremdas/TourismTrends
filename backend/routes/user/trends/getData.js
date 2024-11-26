let express = require("express");
let router = express.Router();

/**
 * Fetches tourism trend data from the database specific to the user.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} req.body - The body of the request containing the request parameters.
 * @param {Array<string>} req.body.type - The type of data to fetch (optional).
 * @param {Array<string>} req.body.dateRange - The date range to filter the data (optional).
 * @param {Array<string>} req.data.region - The region to filter the data (optional).
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */
router.post("/", async (req, res) => {
	try {
		let region = req.body.region || [];

		// limit to "owner" and "business" client types
		if ([!"owner", "business"].includes(req.user.client_type)) {
			res.status(403).json({
				error: true,
				message: `Wrong client type, you are a ${req.user.client_type} client`,
			});
			return;
		}

		// region includes a value greater than 4, or has not values, return an error
		if (
			!Array.isArray(region) ||
			region.length === 0 ||
			region.some((r) => r > 4)
		) {
			res.status(400).json({
				error: true,
				message: "Invalid region",
			});
			return;
		}

		// Get the type from the body or use the default
		let type = req.body.type || [
			"ave_historical_occupancy",
			"ave_daily_rate",
			"ave_length_of_stay",
			"ave_booking_window",
		];

		// Check if the type is valid
		if (
			!Array.isArray(type) ||
			type.some(
				(t) =>
					![
						"ave_historical_occupancy",
						"ave_daily_rate",
						"ave_length_of_stay",
						"ave_booking_window",
					].includes(t)
			)
		) {
			res.status(400).json({
				error: true,
				message: "Invalid type",
			});
			return;
		}

		// Get the date range from the body or use the default
		let dateRange = req.body.dateRange || ["2023-01-01", "2024-12-31"];

		// Check if the date range is valid
		if (dateRange.length !== 2) {
			res.status(400).json({
				error: true,
				message: "Invalid date range",
			});
			return;
		}

		// Define the columns to select based on the type
		let columns = {
			ave_historical_occupancy: "t.average_historical_occupancy",
			ave_daily_rate: "t.average_daily_rate",
			ave_length_of_stay: "t.average_length_of_stay",
			ave_booking_window: "t.average_booking_window",
		};

		let selectedColumns = type.reduce(
			(acc, t) => {
				if (columns[t]) acc[t] = columns[t];
				return acc;
			},
			{
				id: "t.id",
				date: "t.date",
				lga_id: "t.lga_id",
				lga_name: "lga.lga_name",
			}
		);

		// Check if the user-specific table exists
		let tableName =
			req.user.role === "admin" && req.user.client_id === 1 // site admin
				? `trends`
				: `user_trends_${req.user.client_id}`;
		let tableExists = await req.db.schema.hasTable(tableName);

		if (!tableExists) {
			res.status(404).json({
				error: true,
				message: "User-specific data not found",
			});
			return;
		}

		let results = await req
			.db(`${tableName} as t`)
			.select(selectedColumns)
			.join("lgas", "t.lga_id", "lgas.id")
			.whereIn("lgas.id", region)
			.whereBetween("t.date", dateRange)
			.groupBy("t.id", "t.date", ...Object.values(selectedColumns));

		// Case where no data found
		if (!results || results.length === 0) {
			res.status(400).json({
				error: true,
				message: "No data found",
			});
			return;
		}

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
				region,
				type,
				dateRange,
			},
			results,
			retrievedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
