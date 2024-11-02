let express = require("express");
let router = express.Router();
let swaggerUI = require("swagger-ui-express");
// let swaggerOptions = require("./api-docs/swaggerOptions");
let swaggerOptions = require("./api-docs/swaggerOptions.json");

// setup 500 error handling (attaches to all routes)
router.use("*", require("../middleware/error/fiveHundred"));

const { verifyJwtAndAddUser } = require("../middleware/verifyJwtAndAddUser");

// GET Define a simple route to check if our server works
router.get("/helloWorld", verifyJwtAndAddUser, (req, res) => {
	res.send("Hello World!");
});

// Swagger UI setup
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// GET tourism trends
router.use("/trends", verifyJwtAndAddUser, require("./trends/data"));

const { rejectInvalidUrlQueryParams } = require("..//middleware/requestTests");

// reject URL parameters for all routes
router.use("*", rejectInvalidUrlQueryParams);

// GET movie posters
// router.use("/posters", require("../middleware/loadPosterDir"));
// router.use("/posters", require("./posters/getPoster"));

// POST movie posters
// router.use("/posters/add/", require("./posters/addPoster"));

// Rate Limit user section
router.use("/user/*", require("../middleware/rateLimitUsers"));

// GET user login
router.use("/user/login", require("./user/login"));

// GET user registration
router.use("/user/register", verifyJwtAndAddUser, require("./user/register"));

// Display 404 page
router.use("*", require("./404/404"));

module.exports = router;
