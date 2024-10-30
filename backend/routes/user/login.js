let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Test if the users table exists, if not create it
router.use("/", require("../../middleware/testUsersTableExists"));

// test for valid query parameters and body
const {
	rejectInvalidQueryParams,
	requireEmailAndPassword,
} = require("../../middleware/requestTests");

router.post(
	"/",
	rejectInvalidQueryParams,
	requireEmailAndPassword,
	async function (req, res, next) {
		try {
			// process body of request
			let email = req.body.email ? req.body.email[0] : null;
			let password = req.body.password ? req.body.password[0] : null;

			// check for a username and password
			if (!email || !password) {
				res.status(400).json({
					error: true,
					message:
						"Request body incomplete, both email and password are required",
				});
				return;
			}

			// Check if user exists in database
			let user = await req.db("users").where("email", email);
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
					user: email,
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
	}
);

module.exports = router;
