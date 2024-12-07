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

		let data = req.body.data;

		// Check if the data is present in the request body
		if (!data || Array.isArray(data) || data.length === 0) {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, data is required",
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

		// test the keys of the data object
		// 1. All Keys Check
		// 2. Date and lga_id Check
		// 3. At least one of the four data keys
		let keysValid = data.every(
			(d) =>
				Object.keys(d).every((k) =>
					[
						"date",
						"lga_id",
						"average_historical_occupany",
						"average_daily_rate",
						"average_length_of_stay",
						"average_booking_window",
					].includes(k)
				) &&
				["date", "lga_id"].every((k) => Object.keys(d).includes(k)) &&
				[
					"average_historical_occupancy",
					"average_daily_rate",
					"average_length_of_stay",
					"average_booking_window",
				].some((k) => Object.keys(d).includes(k))
		);

		if (!keysValid) {
			res.status(400).json({
				error: true,
				message: "Invalid data keys",
			});
			return;
		}

		// Date is a string in form of "YYYY-MM-DD"
		let dateValid = data.every((d) => {
			let date = new Date(d.date);
			return date instanceof Date && !isNaN(date);
		});

		if (!dateValid) {
			res.status(400).json({
				error: true,
				message: "Invalid date format",
			});
			return;
		}

		// Convert string values to numbers if they exist
		data = data.map((d) => {
			if (d.average_historical_occupancy) {
				d.average_historical_occupancy = Number(d.average_historical_occupancy);
			}
			if (d.average_daily_rate) {
				d.average_daily_rate = Number(d.average_daily_rate);
			}
			if (d.average_length_of_stay) {
				d.average_length_of_stay = Number(d.average_length_of_stay);
			}
			if (d.average_booking_window) {
				d.average_booking_window = Number(d.average_booking_window);
			}
			return d;
		});

		// Check if the user-specific table exists
		let tableName =
			req.user.client_id === 1 && req.user.role === "admin"
				? `trends`
				: `user_trends_${req.user.client_id}`;
		let tableExists = await req.db.schema.hasTable(tableName);

		if (!tableExists) {
			// create the table
			await req.db.schema.createTable(tableName, (table) => {
				table.increments("id").primary();
				table.date("date").notNullable();
				table.integer("lga_id").notNullable();
				table.float("average_historical_occupancy").notNullable();
				table.float("average_daily_rate").notNullable();
				table.float("average_length_of_stay").notNullable();
				table.float("average_booking_window").notNullable();
			});
		}

		// add data to the table
		let response = await req.db(tableName).insert(data);

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
				toDelete,
			},
			addedCount: response,
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
