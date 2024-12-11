let express = require("express");
let router = express.Router();

/**
 * Fetches tourism trend data from the database based on the specified criteria.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * tags:
 *   name: Trend Types
 *   description: The Trend Types endpoint fetches tourism trend types from the database.
 */

/**
 * @swagger
 * /trend/types:
 *   get:
 *     summary: Fetch tourism trend types
 *     tags: [Trend Types]
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
 *                 - id: 1
 *                   name: "Tourism"
 *                   description: "Tourism trends"
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
		// Query the trend_types table for all trend types
		let trendTypes = await req
			.db("trend_types")
			.select("id", "name", "description");

		res.status(200).json({
			error: false,
			message: "Success",
			results: trendTypes,
			retrievedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
