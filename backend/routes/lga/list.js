let express = require("express");
let router = express.Router();

// GET handler for a lgas list
router.get("/", async (req, res) => {
	try {
		let lgas = await req.db("lgas");
		if (lgas.length > 0) {
			res.status(200).json({
				error: false,
				message: "Success",
				results: lgas,
				retrivedAt: new Date().toLocaleString(),
			});
			return;
		}
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
