let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");

// Test if the users table exists, if not create it
router.use("/", require("../../middleware/testUsersTableExists"));

// test for valid query parameters and body
const {
	rejectInvalidQueryParams,
	requireEmailAndPassword,
} = require("../../middleware/requestTests");

// POST handler for a user registration
router.post(
	"/",
	rejectInvalidQueryParams,
	requireEmailAndPassword,
	async (req, res) => {
		try {
			// process body of request
			let email = req.body.email ? req.body.email[0] : null;
			let password = req.body.password ? req.body.password[0] : null;

			// check for valid username and password
			if (!email || !password) {
				res.status(400).json({
					error: true,
					message:
						"Request body incomplete, both email and password are required",
				});
				return;
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

			// hash password
			const hash = await bcrypt.hash(password, 10); // 10 is the salt rounds

			// insert user into database
			await req.db("users").insert({
				email,
				hash,
			});

			res.status(201).json({
				message: "User created",
			});
		} catch (error) {
			res.fiveHundred(error);
			return;
		}
	}
);

module.exports = router;
