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

		// Check if user exists in database
		let user = await req
			.db("users")
			.select(
				"users.id",
				"users.client_id",
				"users.email",
				"users.hash",
				"users.role",
				"clients.c_name as client_name",
				"clients.c_type as client_type",
				"clients.id"
			)
			.join("clients", "users.client_id", "clients.id")
			.where("email", email);
		if (user.length === 0) {
			res.status(401).json({
				error: true,
				message: "Incorrect email or password",
			});
			return;
		}

		// If user does exist, verify if passwords match
		const match = await bcrypt.compare(password, user[0].hash);

		// If passwords do not match, return error response
		if (!match) {
			res.status(401).json({
				error: true,
				message: "Incorrect email or password",
			});
			return;
		}

		// If passwords match, create a JWT token and return it
		const createdDate = Math.floor(Date.now() / 1000);
		const createdPlusOneDay = createdDate + 24 * 60 * 60; // Adds one day in second
		const token = jwt.sign(
			{
				exp: createdPlusOneDay,
				iat: createdDate,
				user: {
					id: user[0].id,
					email: user[0].email,
					role: user[0].role || "user",
					client_id: user[0].client_id,
					client_name: user[0].client_name,
					client_type: user[0].client_type,
					lga: user[0].lga_id,
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
