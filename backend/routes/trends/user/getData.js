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
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * /trends/user/data:
 *   post:
 *     summary: Fetch user-specific trend data
 *     tags: [Trend Data]
 *     description: Fetches user-specific data from the database based on the specified criteria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["type1", "type2"]
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
 *                 query:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     type:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dateRange:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                 retrievedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: "Data fetched successfully"
 *               query:
 *                 region: [1, 2, 3, 4]
 *                 type: ["type1", "type2"]
 *                 dateRange: ["2021-01-01", "2021-12-31"]
 *               results:
 *                 - id: 1
 *                   region: "Region 1"
 *                   type: "type1"
 *                   date: "2021-01-01"
 *                   value: 100
 *               retrievedAt: "01/01/2021 12:00:00"
 *       400:
 *         description: Invalid request parameters or no data found
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
 *               message: "No data found"
 *       404:
 *         description: User-specific data not found
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
 *               message: "User-specific data not found"
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
		// limit to "owner" and "business" client types
		if (!["admin", "Business"].includes(req.user.client_type)) {
			res.status(403).json({
				error: true,
				message: `Wrong client type: ${req.user.client_type}`,
			});
			return;
		}

		// Get the type from the body or use the default
		let type = req.body.type || ["1"];

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
				noUserTable: true,
			});
			return;
		}

		// Fetch the data from the database
		let results = await req
			.db(`${tableName} as t`)
			.select(
				"t.id",
				"t.lga_id",
				"lgas.lga_name",
				"t.tt_id",
				"t.date",
				"t.value",
				"tt.name",
				"cu.name as upload_name"
			)
			.join("lgas", "t.lga_id", "lgas.id")
			.join("trend_types as tt", "t.tt_id", "tt.id")
			.join("client_uploads as cu", "t.upload_id", "cu.id")
			.whereIn("t.tt_id", type)
			.whereBetween("t.date", dateRange);

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
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
