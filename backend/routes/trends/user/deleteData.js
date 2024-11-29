let express = require("express");
let router = express.Router();

/**
 * Adds tourism trend data to the database for the specific user table
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.db - The database connection object.
 * @param {Object} req.user - The user object containing user information.
 * @param {Object} req.body - The body of the request containing the request parameters.
 * @param {Array<object>} req.body.toDelete - The ids of the rows to delete.
 * @param {Object} res - The response object sent to the client.
 * @returns {Promise<Object>} The response object containing the query results.
 */

/**
 * @swagger
 * /trends/user/delete:
 *   post:
 *     summary: Delete tourism trend data for a specific user
 *     tags: [Trend Data]
 *     description: Deletes tourism trend data from the database for the specific user table
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toDelete:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deleted:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
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
 *               message: "Request body incomplete, toDelete is required"
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
		// limit to "owner" and "business" client types
		if ([!"owner", "business"].includes(req.user.client_type)) {
			res.status(403).json({
				error: true,
				message: `Wrong client type, you are a ${req.user.client_type} client`,
			});
			return;
		}

		let toDelete = req.body.toDelete;
		if (!toDelete || Array.isArray(toDelete) || toDelete.length === 0) {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, toDelete is required",
			});
			return;
		}

		// 1. id exists
		let keysValid = data.every((d) =>
			Object.keys(d).every((k) => ["id"].includes(k))
		);

		// 1. id is a number
		let dataValid = data.every((d) => typeof d.id === "number");

		if (!keysValid || !dataValid) {
			res.status(400).json({
				error: true,
				message: "Invalid toDelete object",
			});
			return;
		}

		// Check if the user-specific table exists
		let tableName =
			req.user.client_id === 1 && req.user.role === "admin"
				? `trends`
				: `user_trends_${req.user.client_id}`;
		let tableExists = await req.db.schema.hasTable(tableName);

		if (!tableExists) {
			res.status(400).json({
				error: true,
				message: `No data to delete`,
			});
			return;
		}

		// Delete the data
		let response = await req.db(tableName).whereIn("id", toDelete).del();

		res.status(200).json({
			error: false,
			message: "Success",
			query: {
				toDelete,
			},
			deleteCount: response,
			deletedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
