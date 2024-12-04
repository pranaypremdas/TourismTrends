let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User login and registration
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Authenticate a user and return a JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@doe.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "a.b.c"
 *                 token_type:
 *                   type: string
 *                   example: "Bearer"
 *                 expires_in:
 *                   type: number
 *                   example: 86400
 *       401:
 *         description: Incorrect email or password
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
 *               message: "Incorrect email or password"
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
router.post("/", async function (req, res, next) {
	try {
		// process body of request, email and password have already been checked
		let email = req.body.email;
		let password = req.body.password;

		let userPasswordCheck = await req
			.db("users")
			.select("hash")
			.where("email", email);

		// If user does not exist, return error response
		if (userPasswordCheck.length === 0) {
			res.status(401).json({
				error: true,
				message: "Incorrect email or password",
			});
			return;
		}

		// If user does exist, verify if passwords match
		const match = await bcrypt.compare(password, userPasswordCheck[0].hash);

		// If passwords do not match, return error response
		if (!match) {
			res.status(401).json({
				error: true,
				message: "Incorrect email or password",
			});
			return;
		}

		// get the user from the database
		let user = await req
			.db("users")
			.select(
				"users.id",
				"users.client_id",
				"users.name",
				"users.email",
				"users.role",
				"clients.c_name as client_name",
				"clients.c_type as client_type",
				"clients.expires_at",
				req.db.raw("GROUP_CONCAT(client_lgas.lga_id) as lgaIds"),
				"users.updated_at",
				"users.created_at"
			)
			.join("clients", "users.client_id", "clients.id")
			.join("client_lgas", "users.client_id", "client_lgas.client_id")
			.where("users.email", email)
			.groupBy(
				"users.id",
				"users.client_id",
				"users.email",
				"users.role",
				"clients.c_name",
				"clients.c_type",
				"clients.expires_at",
				"users.updated_at",
				"users.created_at"
			)
			.first();

		// Check if the user-specific table exists
		let tableName =
			user.client_id === 1 && user.role === "admin"
				? `trends`
				: `user_trends_${user.client_id}`;

		const clientDataExists = await req.db.schema.hasTable(tableName);

		// If passwords match, create a JWT token and return it
		const createdDate = Math.floor(Date.now() / 1000);
		const createdPlusOneDay = createdDate + 24 * 60 * 60; // Adds one day in second
		const token = jwt.sign(
			{
				exp: createdPlusOneDay,
				iat: createdDate,
				user: {
					id: user.id,
					client_id: user.client_id,
					name: user.name,
					email: user.email,
					role: user.role || "user",
					updated_at: user.updated_at,
					created_at: user.created_at,
					dataExists: clientDataExists,
				},
				client: {
					id: user.client_id,
					name: user.client_name,
					type: user.client_type,
					lgaIds: user.lgaIds.split(",").map(Number),
					expires_at: user.expires_at,
					expired: user.expires_at < new Date(),
				},
			},
			process.env.JWT_SECRET
		);

		res.status(200).json({
			token,
			token_type: "Bearer",
			expires_in: createdPlusOneDay - createdDate,
		});
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
