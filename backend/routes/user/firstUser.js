let express = require("express");
let router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
var generator = require("generate-password");

/**
 * POST Request: Register a new user
 * @param {string} email - email of the user
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
		// check if users already exist
		let userCount = await req.db("users").count("id as count").first();
		if (userCount.count > 0) {
			res.status(400).json({
				error: true,
				message: "Users already exist",
				actionFirstUser: false,
			});
			return;
		}

		if (userCount.count === 0 && req.body.checkFirstUser) {
			res.status(200).json({
				error: false,
				message: "No users exist",
				actionFirstUser: true,
			});
			return;
		}

		// process body of request
		let email = req.body.email;
		let name = req.body.name;

		if (!email || !name) {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, email and name is required",
			});
			return;
		}

		// generate random password and hash it
		const password = generator.generate({
			length: 12,
			numbers: true,
		});
		const hash = await bcrypt.hash(password, 10); // 10 is the salt rounds

		// insert user into database
		await req.db("users").insert({
			id: uuidv4(), // obviscate the user id
			client_id: 1,
			email: email,
			name: name,
			role: "admin",
			hash: hash,
		});

		await req.db("clients").insert({
			id: 1,
			c_name: "Tourism Trends",
			c_type: "admin",
			domain: "tourismtrends.com",
			licenses: 9999,
		});

		let lgas = await req.db("lgas").select("id");

		let lgaData = lgas.map((lga) => {
			return {
				lga_id: lga.id,
				client_id: 1,
			};
		});

		await req.db("client_lgas").insert(lgaData);

		res.status(201).json({
			error: false,
			message: "User created",
			results: {
				email,
				password,
			},
		});
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
