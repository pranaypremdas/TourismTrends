let express = require("express");
let router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
var generator = require("generate-password");

/**
 * POST Request: Register a new user
 * @param {string} email - email of the user
 * @param {string} role - role of the user
 * @param {string} client_id - client_id of the user
 * @returns {object} - status of the request
 *
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *                 example: "user"
 *               client_id:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     client_id:
 *                       type: string
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
 *               message: "Request body incomplete, client_id is required"
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
		// process body of request
		let name = req.body.name;
		let email = req.body.email;
		let role = req.body.role;
		let client_id = req.body.client_id;

		// check client_id (have already checked email and password)
		if (!client_id) {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, client_id is required",
			});
			return;
		}

		if (req.user.role === "client_admin") {
			client_id = req.user.client_id;
			role = role === "admin" ? "user" : role; // client_admin can only create users or other client_admins
		}

		// check if email already exists
		let user = await req.db("users").where("email", email);
		if (user.length > 0) {
			res.status(409).json({
				error: true,
				message: "User already exists",
			});
			return;
		}

		// generate random password and hash it
		const password = generator.generate({
			length: 12,
			numbers: true,
		});
		const hash = await bcrypt.hash(password, 10); // 10 is the salt rounds

		let id = uuidv4(); // obviscate the user id's

		// insert user into database
		await req.db("users").insert({
			id: id,
			client_id,
			name,
			email,
			role,
			hash,
		});

		//get the updated user
		const newUser = await req.db("users").where("id", id).first();

		res.status(201).json({
			error: false,
			message: "User created",
			results: {
				id: id,
				name: name,
				email: email,
				password: password,
				role: role,
				client_id: client_id,
				updated_at: newUser.updated_at,
				created_at: newUser.created_at,
			},
		});
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
