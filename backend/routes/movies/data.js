let express = require("express");
let router = express.Router();

// only needed in this route so not using middleware
const getOMDBMoviesByIMDBid = require("./getOMDBMoviesByIMDBid");
const { rejectInvalidQueryParams } = require("../../middleware/requestTests");

// Case where no imdbID
router.get("/", rejectInvalidQueryParams, async (req, res) => {
	res.status(400).json({
		error: true,
		message: "You must supply an imdbID!",
	});
});

// GET movie details by imdbID
router.get("/:imdbID", rejectInvalidQueryParams, async (req, res) => {
	try {
		// get imdbID from url
		let imdbID = req.url.split("/")[1];

		let results = await req
			.db("basics as b")
			.select({
				Title: "b.primaryTitle",
				Year: "b.startYear",
				Runtime: "b.runtimeMinutes",
				Genre: "b.genres",
				Director: req.db.raw("GROUP_CONCAT(DISTINCT n_directors.primaryName)"),
				Writer: req.db.raw("GROUP_CONCAT(DISTINCT n_writers.primaryName)"),
				Actors: req.db.raw("GROUP_CONCAT(DISTINCT n_actors.primaryName)"),
			})
			.join("crew as c", "b.tconst", "c.tconst")
			.joinRaw(
				"JOIN names as n_actors ON FIND_IN_SET(b.tconst, n_actors.knownForTitles)"
			)
			.leftJoin(
				req.db.raw(
					"names as n_directors ON FIND_IN_SET(n_directors.nconst, c.directors)"
				)
			)
			.leftJoin(
				req.db.raw(
					"names as n_writers ON FIND_IN_SET(n_writers.nconst, c.writers)"
				)
			)
			.where("b.tconst", imdbID)
			.groupBy("b.tconst");

		// Case where no movie found
		if (!results || results.length === 0) {
			res.status(400);
			res.json({
				error: true,
				message: "No movie found with this imdbID!",
			});
			return;
		}

		// Get the movie data from OMDB for ratings
		let [retrievedData, error] = await getOMDBMoviesByIMDBid(imdbID);
		if (error) {
			throw error;
		}

		// Combine the results
		let combinedResult = {
			...results[0],
			Ratings: retrievedData.Ratings,
		};

		res.json(combinedResult);
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
