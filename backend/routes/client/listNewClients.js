let express = require("express");
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API for admin users
 */

/**
 * @swagger
 * /client/new/list:
 *   get:
 *     summary: Retrieve a list of newly subscribed clients pending approval
 *     tags: [Admin]
 *     description: Retrieve a list of new clients based on the user's role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of new clients
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
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       client_name:
 *                         type: string
 *                       client_type:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       updated_at:
 *                         type: string
 *                 retrievedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: Success
 *               results:
 *                 - id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                   name: "Client 1"
 *                   email: "client1@example.com"
 *                   client_name: "Client Name 1"
 *                   client_type: "Type 1"
 *                   created_at: "01/01/2021 12:00:00"
 *                   updated_at: "01/01/2021 12:00:00"
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
 *               message: "You are not authorized to view clients"
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
		if (req.user.role === "admin") {
			let clients = await req.db("new_clients");
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
