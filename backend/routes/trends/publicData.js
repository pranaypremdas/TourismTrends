let express = require("express");
let router = express.Router();

/**
 * Fetches tourism trend data from the database based on the specified criteria.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} req.body - The body of the request containing the request parameters.
 * @param {Array<string>} req.body.type - The type of data to fetch (optional).
 * @param {Array<string>} req.body.dateRange - The date range to filter the data (optional).
 * @param {Array<string>} req.query.region - The region to filter the data (optional).
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * tags:
 *   name: Trend Data
 *   description: API for fetching tourism trend data
 */

/**
 * @swagger
 * /trends:
 *   post:
 *     summary: Fetch tourism trend data
 *     tags: [Trend Data]
 *     description: Fetches tourism trend data from the database based on the specified criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3, 4]
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ave_historical_occupancy", "ave_daily_rate"]
 *               dateRange:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["2021-01-01", "2021-12-31"]
 *     responses:
 *       200:
 *         description: Data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       region:
 *                         type: string
 *                       type:
 *                         type: string
 *                       date:
 *                         type: string
 *                       value:
 *                         type: number
 *             example:
 *               error: false
 *               message: "Data fetched successfully"
 *               results:
 *                 - id: 1
 *                   region: "Region 1"
 *                   type: "ave_historical_occupancy"
 *                   date: "2021-01-01"
 *                   value: 100
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               error: true
 *               message: "Invalid region"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               error: true
 *               message: "Internal Server Error"
 */

router.post("/", async (req, res) => {
	try {
		// Get the region from the body or use the user's region if they are a business member
		let region = req.body.region;

		// region includes a value greater than 4, return an error
		if (!Array.isArray(region)) {
			res.status(400).json({
				error: true,
				message: "Invalid region",
			});
			return;
		}

		// limit the region to the user's region if they are a business member (client_type = business) lower subscription level
		// other types are "owner" being TourismTrends admin, and "government/tourism board" being the highest subscription level
		if (req.user.client_type == "business") {
			region = req.user.lga_ids;
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
				lga_name: "lgas.lga_name",
			}
		);

		let results = await req
			.db("trends as t")
			.select(selectedColumns)
			.join("lgas", "t.lga_id", "lgas.id")
			.whereIn("lgas.id", region)
			.whereBetween("t.date", dateRange)
			.groupBy("t.id", "t.date", ...Object.values(selectedColumns));

		// Case where no data found
		if (!results || results.length === 0) {
			res.status(400).json({
				error: true,
				message: "No results found",
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
