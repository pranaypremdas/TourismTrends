const rateLimit = require("express-rate-limit");

// Limit each IP to 5 requests per 15 minutes
module.exports = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many attempts from this IP, please try again after 15 minutes",
});
