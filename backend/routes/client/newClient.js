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
				table.increments("id");
				table.string("name");
				table.string("email");
				table.string("clientName");
				table.string("clientType");
				table.string("lgaIds");
				table.integer("userCount");
				table.string("message");
				table.integer("amount");
				table.string("paymentMethod");
				table.string("quoteRef");
				table.timestamps(true, true);
			});
		}

		// add data to the table
		let quoteRef = uuidv4();
		await req.db("new_clients").insert({ ...newClient, quoteRef: quoteRef });

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
				newClient: newClient,
			},
			quoteRef: quoteRef,
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
