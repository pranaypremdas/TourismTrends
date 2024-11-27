let express = require("express");
let router = express.Router();
const { v4: uuidv4 } = require("uuid");

/**
 * Adds tourism trend data to the database for the specific user table
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.body - The body of the request containing the request parameters.
 * @param {Array<object>} req.body.data - The data to add to the database.
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * tags:
 *  name: Subscription
 *  description: Subscription management
 */

/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: Add a new client subscription from the Contact/Subscription form
 *     tags: [Subscription]
 *     description: Add a new client subscription to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newClient:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john@doe.com"
 *                   clientName:
 *                     type: string
 *                     example: "Client Name"
 *                   clientType:
 *                     type: string
 *                     example: "Type A"
 *                   lgaIds:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["1", "2", "3"]
 *                   userCount:
 *                     type: integer
 *                     example: 10
 *                   message:
 *                     type: string
 *                     example: "This is a message"
 *                   amount:
 *                     type: number
 *                     example: 100.0
 *                   paymentMethod:
 *                     type: string
 *                     example: "Credit Card"
 *     responses:
 *       201:
 *         description: Subscription added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 client:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     clientName:
 *                       type: string
 *                     clientType:
 *                       type: string
 *                     lgaIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     userCount:
 *                       type: integer
 *                     message:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     paymentMethod:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *       400:
 *         description: Bad request
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
 *               message: "Request body incomplete"
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
		const newClient = req.body.newClient;
		if (!newClient || !typeof newClient === "object") {
			res.status(400).json({
				error: true,
				message: "Request body incomplete",
			});
			return;
		}

		// test the keys of the object
		// 1. All Keys Check
		let keysValid = Object.keys(newClient).every((d) =>
			[
				"name",
				"email",
				"clientName",
				"clientType",
				"lgaIds",
				"userCount",
				"message",
				"amount",
				"paymentMethod",
			].includes(d)
		);

		if (!keysValid) {
			res.status(400).json({
				error: true,
				message: "Invalid object",
			});
			return;
		}

		// Check if the user-specific table exists
		let tableExists = await req.db.schema.hasTable("new_clients");

		if (!tableExists) {
			// create the table
			await req.db.schema.createTable("new_clients", (table) => {
				table.uuid("id").primary();
				table.string("name");
				table.string("email");
				table.string("c_name");
				table.string("c_type");
				table.string("lgaIds");
				table.integer("licenses");
				table.string("message");
				table.integer("amount");
				table.string("paymentMethod");
				table.string("quoteRef");
				table.string("status").defaultTo("pending");
				table.timestamps(true, true);
			});
		}

		// add data to the table
		let insertClient = {
			name: newClient.name,
			email: newClient.email,
			c_name: newClient.clientName,
			c_type: newClient.clientType,
			lgaIds: newClient.lgaIds.join(","),
			licenses: newClient.userCount,
			message: newClient.message,
			amount: newClient.amount,
			paymentMethod: newClient.paymentMethod,
			quoteRef: `QRef-${uuidv4().split("-")[0]}`,
		};

		let insertedClient = await req
			.db("new_clients")
			.insert(insertClient)
			.returns("*");

		res.status(200).json({
			error: false,
			message: "Success",
			results: insertedClient,
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
