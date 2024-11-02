let express = require("express");
let router = express.Router();
let fs = require("fs");
const {
	rejectInvalidUrlQueryParams,
} = require("../../middleware/requestTests");

// verify that the user is logged in
router.use("/", require("../../middleware/verifyJwtAndAddUser"));

// case where no imdbID
router.post("/", rejectInvalidUrlQueryParams, async (req, res) => {
	res.status(400).json({
		error: true,
		message: "You must supply an imdbID!",
	});
});

// POST movie posters route
router.post("/:imdbID", rejectInvalidUrlQueryParams, (req, res) => {
	try {
		// test for invalid query parameters
		if (Object.keys(req.query).length > 0) {
			res.status(400).json({
				error: true,
				message: `Invalid query parameters: ${Object.keys(
					req.query
				)}. Query parameters are not permitted.`,
			});
			return;
		}

		// get the user from req.user object
		let userEmail = req.user.email;

		// get imdbID from url
		let imdbID = req.url.split("/")[1];

		// get the poster file from the body of the POST
		let file = req.files.userFile[0];

		// case where no imdbId or no file provided, or file is not a png
		if (
			!imdbID ||
			!file ||
			!file.originalFilename ||
			file.originalFilename.split(".").pop() !== "png"
		) {
			res.json({
				error: true,
				message:
					"A filetype other than png has been provided, or no imdbID has been provided",
			});
			return;
		}

		// save the poster
		let newFileName = `./res/posters/${userEmail}_${imdbID}.png`;
		fs.copyFile(file.filepath, newFileName, (error) => {
			if (error) {
				res.json({
					error: true,
					message: `ENOENT: no such file or directory, open '${newFileName}'`,
				});
				return;
			}

			// delete the temp file
			fs.unlink(file.filepath, (error) => {
				if (error) {
					throw error;
				}
			});
		});

		res.json({ message: "Poster uploaded successfully" });
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
