let express = require("express");
let router = express.Router();

/**
 * Adds tourism trend data to the database for the specific user table
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} req.body - The body of the request containing the request parameters.
 * @param {Array<object>} req.body.data - The data to add to the database.
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * /trends/user/add:
 *   post:
 *     summary: Add tourism trend data for a specific user table
 *     tags: [Trend Data]
 *     description: Adds tourism trend data to the database for the specific user table
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2021-01-01"
 *                     lga_id:
 *                       type: integer
 *                       example: 1
 *                     value1:
 *                       type: number
 *                       example: 100
 *                     value2:
 *                       type: number
 *                       example: 200
 *                     value3:
 *                       type: number
 *                       example: 300
 *                     value4:
 *                       type: number
 *                       example: 400
 *     responses:
 *       201:
 *         description: Data added successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                       lga_id:
 *                         type: integer
 *                       value1:
 *                         type: number
 *                       value2:
 *                         type: number
 *                       value3:
 *                         type: number
 *                       value4:
 *                         type: number
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
 *               message: "Request body incomplete, data is required"
 *       403:
 *         description: Forbidden
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
 *               message: "Wrong client type, you are a business client"
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
		// Check if the user is a business client
		if (req.user.role === "Government") {
			res.status(403).json({
				error: true,
				message: "Wrong client type",
			});
			return;
		}

		// Check if the upload object is present in the request body
		if (!req.body.upload || typeof req.body.upload !== "object") {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, upload is required",
			});
			return;
		}

		let upload = { ...req.body.upload, client_id: req.user.client_id };

		let dataByType = [];

		upload.fileData.forEach((row) => {
			let newRow = {
				date: row[upload.idTypes.date],
				lga_id: Number(upload.lga),
			};
			upload.idTypes.trendTypes.forEach((column) => {
				if (column.colName !== "ignore") {
					dataByType.push({
						...newRow,
						tt_id: column.id,
						value: Number(row[column.colName]),
					});
				}
			});
		});

		console.log(dataByType);

		// Check if the user-specific table exists
		let tableName =
			req.user.client_id === 1 && req.user.role === "admin"
				? `trends`
				: `user_trends_${req.user.client_id}`;
		let tableExists = await req.db.schema.hasTable(tableName);

		// if (!tableExists) {
		// 	// create the table
		// 	await req.db.schema.createTable(tableName, (table) => {
		// 		table.increments("id").primary();
		// 		table.date("date").notNullable();
		// 		table.integer("lga_id").notNullable();
		// 		table.float("average_historical_occupancy").notNullable();
		// 		table.float("average_daily_rate").notNullable();
		// 		table.float("average_length_of_stay").notNullable();
		// 		table.float("average_booking_window").notNullable();
		// 	});
		// }

		// add data to the table
		// let response = await req.db(tableName).insert(data);

		res.status(200).json({
			error: false,
			message: "Success",
			query: {},
			// addedCount: response,
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
