let express = require("express");
let router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// POST handler for a user registration
router.post("/", async (req, res) => {
	try {
		// process body of request
		console.log("req.body", req.body);
		let email = req.body.email ? req.body.email[0] : null;
		let password = req.body.password ? req.body.password[0] : null;
		let role = req.body.role ? req.body.role[0] : "user";
		let client_id = req.body.client_id ? req.body.client_id[0] : null;

		// check client_id (have already checked email and password)
		if (!client_id) {
			res.status(400).json({
				error: true,
				message: "Request body incomplete, client_id is required",
			});
			return;
		}

		// check role of validated user
		// site admin can create any user
		// client admin can create users for their client
		if (
			(req.user.role !== "admin" && req.user.client_id !== 1) ||
			(req.user.role !== "client_admin" && req.user.client_id !== client_id)
		) {
			res.status(403).json({
				error: true,
				message: "You are not authorized to create a user",
			});
			return;
		}

		if (req.user.role === "client_admin") {
			client_id = req.user.client_id;
			role = role === "admin" ? "user" : role;
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
			id: uuidv4(), // obviscate the user id
			client_id,
			email,
			role,
			hash,
		});

		res.status(201).json({
			message: "User created",
		});
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
