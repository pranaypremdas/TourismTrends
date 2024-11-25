let express = require("express");
let router = express.Router();

// GET handler for a user list
router.get("/", async (req, res) => {
	try {
		// check role of validated user
		// site admin can create any user
		// client admin can create users for their client
		if (req.user.role !== "admin" && req.user.client_id !== "1") {
			res.status(403).json({
				error: true,
				message: "You are not authorized to view users",
			});
			return;
		}

		// get all of the users for that client
		if (req.user.role === "client_admin") {
			client_id = req.user.client_id;
			let user = await req.db("users").where("client_id", client_id);
			if (user.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: user,
				});
				return;
			}
		}

		if (req.user.role === "admin") {
			let user = await req.db("users");
			if (user.length > 0) {
				res.status(200).json({
					error: false,
					message: "Success",
					results: user,
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
