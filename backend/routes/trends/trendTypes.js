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
 * /trends/types:
 *   get:
 *     summary: Fetch tourism trend types
 *     tags: [Trend Data]
 *     description: Fetches tourism trend types from the database
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
 *                     type: string
 *             example:
 *               error: false
 *               message: "Data fetched successfully"
 *               results:
 *                 - "average_historical_occupancy"
 *                 - "average_historical_rate"
 *                 - "average_length_of_stay"
 *                 - "average_daily_rate"
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

router.get("/", async (req, res) => {
	try {
		// get the column names from the database for "trends" table
		let columnHeaders = await req.db("trends").columnInfo();

		let columns = Object.keys(columnHeaders).filter(
			(key) => !["id", "date", "lga_id"].includes(key)
		);

		columnsDescribed = columns.map((column) => ({
			id: column,
			name: column
				.replace(/_./g, (match) => ` ${match[1].toUpperCase()}`)
				.replace(/^./, (match) => match.toUpperCase()),
		}));

		res.status(200).json({
			error: false,
			message: "Success",
			results: { public: columnsDescribed, user: [] },
			retrievedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
