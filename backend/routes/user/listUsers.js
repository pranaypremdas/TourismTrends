let express = require("express");
let router = express.Router();

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Admin]
 *     description: Retrieve a list of users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
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
 *                       client_id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       updated_at:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                 retrivedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: Success
 *               results:
 *                 - id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                   client_id: "1"
 *                   name: "John Doe"
 *                   email: "john@doe.com"
 *                   role: "client_admin"
 *                   updated_at: "01/01/2021 12:00:00"
 *                   created_at: "01/01/2021 12:00:00"
 *               retrivedAt: "01/01/2021 12:00:00"
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
		// get all of the users for that client
		if (req.user.role === "client_admin") {
			let user = await req
				.db("users")
				.select(
					"id",
					"client_id",
					"name",
					"email",
					"role",
					"updated_at",
					"created_at"
				)
				.where("client_id", req.user.client_id);
			if (user.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: user,
					retrivedAt: new Date().toLocaleString(),
				});
				return;
			}
		}

		if (req.user.role === "admin") {
			let user = await req
				.db("users")
				.select(
					"id",
					"client_id",
					"name",
					"email",
					"role",
					"updated_at",
					"created_at"
				);
			if (user.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: user,
					retrivedAt: new Date().toLocaleString(),
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
