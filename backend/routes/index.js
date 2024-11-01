let express = require("express");
let router = express.Router();
let swaggerUI = require("swagger-ui-express");
// let swaggerOptions = require("./api-docs/swaggerOptions");
let swaggerOptions = require("./api-docs/swaggerOptions.json");

//This API exposes a small number of REST endpoints which implement CRUD operations on a database containing publicly available data from the Internet Movie Database. This API provides information on movies published from the year 1973. The API endpoints and their usage are described in detail below.

// setup 500 error handling (attaches to all routes)
router.use("*", require("../middleware/error/fiveHundred"));

// GET Define a simple route to check if our server works
router.get("/helloWorld", (req, res) => {
	res.send("Hello World!");
});

// Swagger UI setup
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// Test if the users table exists, if not create it
router.use("/", require("../middleware/testUsersTableExists"));

// verify that the user is logged in
router.use("/", require("../middleware/verifyTokenAndAddUser"));

// GET tourism trends
router.use("/trends", require("./trends/data"));

// GET movie posters
router.use("/posters", require("../middleware/loadPosterDir"));
router.use("/posters", require("./posters/getPoster"));

// POST movie posters
router.use("/posters/add/", require("./posters/addPoster"));

// Rate Limit user section
router.use("/user/*", require("../middleware/rateLimitUsers"));

// GET user login
router.use("/user/login", require("./user/login"));

// GET user registration
router.use("/user/register", require("./user/register"));

// Display 404 page
router.use("*", require("./404/404"));

module.exports = router;
