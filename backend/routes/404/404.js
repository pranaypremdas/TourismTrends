let express = require("express");
let router = express.Router();

// 404 route
router.get("*", (req, res) => {
	res.status(404).send("404: Page not found");
});

router.post("*", (req, res) => {
	res.status(404).send("404: Page not found");
});

router.put("*", (req, res) => {
	res.status(404).send("404: Page not found");
});

router.delete("*", (req, res) => {
	res.status(404).send("404: Page not found");
});

module.exports = router;
