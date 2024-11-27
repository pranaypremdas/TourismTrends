let express = require("express");
let router = express.Router();

/**
 * Retrieves a list of clients from the database based on the client's ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.db - The database connection.
 * @param {string} req.user.client_id - The ID of the client to filter by.
 * @returns {Promise<Array>} A promise that resolves to an array of client objects.
 */

/**
 * @swagger
 * /client/list:
 *   get:
 *     summary: Retrieve a list of clients
 *     tags: [Admin]
 *     description: Retrieve a list of clients based on the user's role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of clients
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
 *                         type: string
 *                       c_name:
 *                         type: string
 *                       c_type:
 *                         type: string
 *                       domain:
 *                         type: string
 *                       licenses:
 *                         type: number
 *                       updated_at:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                 retrievedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: Success
 *               results:
 *                 - id: "1"
 *                   c_name: "Client Name 1"
 *                   c_type: "Business"
 *                   domain: "client1.com"
 *                   licenses: 100
 *                   updated_at: "01/01/2021 12:00:00"
 *                   created_at: "01/01/2021 12:00:00"
 *               retrievedAt: "01/01/2021 12:00:00"
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
 *               message: "You are not authorized"
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
		if (req.user.role === "client_admin") {
			let clients = await req.db("clients").where("id", req.user.client_id);
			if (clients.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: clients,
					retrievedAt: new Date().toLocaleString(),
				});
				return;
			}
		}
		if (req.user.role === "admin") {
			let clients = await req.db("clients");
			if (clients.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: clients,
					retrievedAt: new Date().toLocaleString(),
				});
				return;
			}
		}
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
