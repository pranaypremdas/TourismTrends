let express = require("express");
let router = express.Router();
let fs = require("fs");
const {
	rejectInvalidUrlQueryParams,
} = require("../../middleware/requestTests");

// verify that the user is logged in, and add the user to the request object
router.use("/", require("../../middleware/verifyJwtAndAddUser"));

// case where no imdbID
router.get("/", rejectInvalidUrlQueryParams, async (req, res) => {
	res.status(400).json({
		error: true,
		message: "You must supply an imdbID!",
	});
});

// GET movie posters
router.get("/:imdbID", rejectInvalidUrlQueryParams, async (req, res) => {
	try {
		// get the user from req.user object
		let userEmail = req.user.email;

		// get imdbID from url
		let imdbID = req.url.split("/")[1];

		// Case where no imdbID
		if (!imdbID) {
			res.status(400).json({
				error: true,
				message: "You must supply an imdbID!",
			});
			return;
		}

		// get the poster file name from the posterDirList to confirm it exists
		let posterFileName = userEmail + "_" + imdbID + ".png";
		if (!req.posterDirList.includes(posterFileName)) {
			res.status(500).json({
				error: true,
				message: `ENOENT: no such file or directory, open 'res/posters/${posterFileName}'`, // mimic the error message of fs.readFile
			});
			return;
		}

		// get the file
		fs.readFile("./res/posters/" + posterFileName, (error, data) => {
			if (error) {
				throw error;
			}

			// send the image as binary
			// this could also be changed to send a public URL to the image
			res.status(200);
			res.end(data, "binary");
		});
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
