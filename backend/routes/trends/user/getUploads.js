let express = require("express");
let router = express.Router();

/**
 * Adds tourism trend data to the database for the specific user table
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * /trends/user/uploads:
 *   get:
 *     summary: Get List of Uploads made by the user
 *     tags: [Trend Data]
 *     description: Fetches the list of uploads made by the user
 *     security:
 *       - bearerAuth: []
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
router.get("/", async (req, res) => {
	try {
		// Check if the user is a business client
		if (req.user.type === "Government") {
			res.status(403).json({
				error: true,
				message: "Wrong client type",
			});
			return;
		}

		if (
			req.user.client_type === "Business" &&
			req.user.role === "client_admin"
		) {
			// Log the upload to "client_uploads" table
			let uploadsByClient = await req
				.db("client_uploads")
				.where("client_id", req.user.client_id);

			res.status(200).json({
				error: false,
				message: "Success",
				results: uploadsByClient,
				addedAt: new Date().toLocaleString(),
			});
		}

		if (req.user.client_type === "admin" && req.user.role === "admin") {
			// Log the upload to "client_uploads" table
			let uploadsByClient = await req.db("client_uploads");

			res.status(200).json({
				error: false,
				message: "Success",
				results: uploadsByClient,
				addedAt: new Date().toLocaleString(),
			});
		}
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
