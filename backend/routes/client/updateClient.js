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
		// check role of validated user
		// site admin can create any user
		// client admin can create users for their client
		if (req.user.role !== "admin" && req.user.client_id !== "1") {
			res.status(403).json({
				error: true,
				message: "You are not authorized to view clients",
			});
			return;
		}

		const createClient = req.body.createClient;
		if (!createClient || !typeof createClient === "object") {
			res.status(400).json({
				error: true,
				message: "Request body incomplete",
			});
			return;
		}

		// test the keys of the object
		// 1. All Keys Check
		let keysValid = Object.keys(newClient).every((d) => ["id"].includes(d));

		if (!keysValid) {
			res.status(400).json({
				error: true,
				message: "Invalid object",
			});
			return;
		}

		// add data to the table
		let quoteRef = uuidv4();
		await req.db("clients").insert({ ...newClient, quoteRef: quoteRef });

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
				newClient: newClient,
			},
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
