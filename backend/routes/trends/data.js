let express = require("express");
let router = express.Router();

// GET movie details by imdbID
router.get("/", async (req, res) => {
	try {
		console.log("req.body", req.body);
		let region = req.body.region;
		let dateRange = req.body.dateRange || ["2023-01-01", "2024-12-31"];

		// Case where no region provided
		if (!region || typeof region !== "string") {
			res.status(400);
			res.json({
				error: true,
				message: "No region provided",
			});
			return;
		}

		// if dateRange is provided, check if it is valid
		if (dateRange && dateRange.length !== 2) {
			res.status(400);
			res.json({
				error: true,
				message: "Invalid date range",
			});
			return;
		}

		// Query the database
		let results = await req
			.db("trends as t")
			.select({
				id: "t.id",
				date: "t.date",
				ave_historical_occupancy: "t.average_historical_occupancy",
				ave_daily_rate: "t.average_daily_rate",
				ave_length_of_stay: "t.average_length_of_stay",
				ave_booking_window: "t.average_booking_window",
			})
			.join("lga", "t.lga_id", "lga.id")
			.where("lga.lga_name", region)
			.whereBetween("t.date", dateRange)
			.groupBy(
				"t.id",
				"t.date",
				"t.average_historical_occupancy",
				"t.average_daily_rate",
				"t.average_length_of_stay",
				"t.average_booking_window",
				"lga.lga_name"
			);

		// Case where no movie found
		if (!results || results.length === 0) {
			res.status(400);
			res.json({
				error: true,
				message: "No region found",
			});
			return;
		}

		res.json(results);
	} catch (error) {
		res.fiveHundred(error);
	}
});

module.exports = router;
