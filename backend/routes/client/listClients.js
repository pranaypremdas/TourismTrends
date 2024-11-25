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
				message: "You are not authorized to view clients",
			});
			return;
		}

		let clients = await req.db("clients");
		console.log(clients);
		if (clients.length > 0) {
			res.status(200).json({
				error: false,
				message: "Success",
				results: clients,
			});
			return;
		}
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
