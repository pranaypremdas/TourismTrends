const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

// Initialize express app
const app = express();

// Use helmet middleware for security
app.use(helmet());

// Use morgan middleware for logging
app.use(require("./middleware/logging/logAccessRequest"));

// Use CORS middleware to allow cross-origin requests
app.use(
	cors({
		origin: "https://localhost",
		credentials: true,
	})
);

// add in knex middleware
app.use(require("./middleware/loadDatabaseConnection"));

// add in formidable middleware
app.use(require("./middleware/incomingForm"));

// Get routes from routes folder
app.use("/", require("./routes/index"));

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
