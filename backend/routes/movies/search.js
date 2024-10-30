let express = require("express");
let router = express.Router();

// http://localhost:port/movies/search?title={title}&year={year}&page={page}
// Returns a list of movie data. The list is arranged by imdbId, in ascending order.

// Route to get movies by title and year
router.get("/", async function (req, res, next) {
	try {
		// get title, year, and page from url
		let title = req.query.title;

		// Case where no title
		if (!title) {
			res.status(400);
			res.json({
				error: true,
				message: "You must supply a title!",
			});
			return;
		}

		// Assuming currentPage and perPage are obtained from query parameters or set to default values
		const currentPage = parseInt(req.query.page) || 1;
		const perPage = 100;
		const offset = (currentPage - 1) * perPage;

		// get year from url
		const year = req.query.year;

		// Building the query conditionally based on whether a year is provided
		// use ? to prevent SQL injection
		let queryCondition = "LOWER(primaryTitle) LIKE LOWER(?)";
		let queryParams = [`%${title}%`];

		if (year) {
			// validate year
			if (isNaN(year) || year.length !== 4) {
				res.status(400);
				res.json({
					error: true,
					message: "Invalid year format. Format must be yyyy.",
				});
				return;
			}
			queryCondition += " AND startYear = ?";
			queryParams.push(year);
		}

		// Query for the total count
		let response = await req.db
			.from("basics")
			.whereRaw(queryCondition, queryParams)
			.count({ total: "*" })
			.first();

		// if total is 0, return an empty array
		if (response.total === 0) {
			res.json({
				error: false,
				data: [],
				pagination: {
					total: 0,
					lastPage: 0,
					perPage: perPage,
					currentPage: currentPage,
					from: 0,
					to: 0,
				},
			});
			return;
		}

		// Query for the page data
		let rows = await req.db
			.from("basics")
			.select("primaryTitle", "startYear", "tconst", "titleType")
			.whereRaw(queryCondition, queryParams)
			.limit(perPage)
			.offset(offset);

		let formattedRows = rows.map((row) => {
			return {
				Title: row.primaryTitle,
				Year: row.startYear,
				imdbID: row.tconst,
				Type: row.titleType,
			};
		});

		const lastPage = Math.ceil(response.total / perPage);
		const pagination = {
			total: parseInt(response.total),
			lastPage: lastPage,
			perPage: perPage,
			currentPage: currentPage,
			from: offset,
			to: offset + rows.length - 1,
		};

		res.json({ error: false, data: formattedRows, pagination: pagination });
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
