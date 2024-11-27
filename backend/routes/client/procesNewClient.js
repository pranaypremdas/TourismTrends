let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const generator = require("generate-password");

/**
 * @swagger
 * /client/new/process:
 *   post:
 *     summary: Finalize the registration of a new client
 *     tags: [Admin]
 *     description: Update a client's information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createClient:
 *                 type: object
 *                 properties:
 *                   client_id:
 *                     type: string
 *                     example: "1"
 *     responses:
 *       200:
 *         description: Client updated successfully
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
 *                     c_name:
 *                       type: string
 *                     c_type:
 *                       type: string
 *                     domain:
 *                       type: string
 *                     licenses:
 *                       type: integer
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     client_id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     hash:
 *                       type: string
 *                 addedAt:
 *                   type: string
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
		const createClient = req.body.createClient;
		if (!createClient || !typeof createClient === "object") {
			res.status(400).json({
				error: true,
				message: "Request body incomplete",
			});
			return;
		}

		// test the keys of the object
		if (!Object.keys(createClient).includes("client_id")) {
			res.status(400).json({
				error: true,
				message: "Invalid object",
			});
			return;
		}

		// retrieve the client data from newClient table
		const client = await req
			.db("new_clients")
			.where("id", createClient.client_id)
			.first();

		// generate random password and hash it
		const password = generator.generate({
			length: 12,
			numbers: true,
		});
		const hash = await bcrypt.hash(password, 10); // 10 is the salt rounds

		let newClient = {
			c_name: client.c_name,
			c_type: client.c_type,
			domain: client.email.split("@")[1],
			licenses: client.licenses,
		};

		// add data to the tables
		let insertedClient = await req
			.db("clients")
			.insert(newClient)
			.returning("*");

		let newUser = {
			client_id: insertedClient.id,
			email: client.email,
			name: client.name,
			role: "client_admin",
			hash: hash,
		};
		let insertedUser = await req.db("users").insert(newUser).returning("*");

		res.status(200).json({
			error: false,
			message: "Success",
			client: insertedClient,
			user: insertedUser,
			addedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
