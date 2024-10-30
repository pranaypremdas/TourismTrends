const fs = require("fs");

// Middleware to load and parse poster list
// This middleware reads the list of posters from the directory and attaches it to the request object
// In future this can be replaced with a database query to get the list of posters
module.exports = (req, res, next) => {
	try {
		// Read the list of posters from the directory
		let posterDirList = fs.readdirSync("./res/posters/");

		// Attach posterDirList to the request object
		req.posterDirList = posterDirList;
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		// Handle errors (e.g., file not found, JSON parse error)
		next(error);
	}
};
