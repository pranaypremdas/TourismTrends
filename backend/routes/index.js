let express = require("express");
let router = express.Router();
let swaggerUI = require("swagger-ui-express");
let swaggerOptions = require("./api-docs/swaggerOptions.json");

const { verifyJwtAndAddUser } = require("../middleware/verifyJwtAndAddUser");
const {
	rejectInvalidUrlQueryParams,
	requireEmailAndPassword,
} = require("../middleware/requestTests");

// setup 500 error handling (attaches to all routes)
router.use("*", require("../middleware/error/fiveHundred"));

// reject URL parameters for all routes
router.use("*", rejectInvalidUrlQueryParams);

// GET Define a simple route to check if our server works
router.get("/helloWorld", verifyJwtAndAddUser, (_, res) => {
	res.send("Hello World!");
});

// Swagger UI setup
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// GET tourism trends
router.use("/trends", verifyJwtAndAddUser, require("./trends/publicData"));

// GET user data
router.use(
	"/user/trends/get",
	verifyJwtAndAddUser,
	require("./user/trends/getData")
);

// POST userData
router.use(
	"/user/trends/add",
	verifyJwtAndAddUser,
	require("./user/trends/addData")
);

//  DEL user data
// #TODO: Implement delete user data
// router.use(
// 	"/user/trends/delete",
// 	verifyJwtAndAddUser,
// 	require("./user/trends/deleteData")
// );

// POST user registration
router.use(
	"/user/register",
	// verifyJwtAndAddUser,
	requireEmailAndPassword,
	require("./user/register")
);

// POST user login
router.use("/user/login", requireEmailAndPassword, require("./user/login"));

// Display 404 page
router.use("*", require("./404/404"));

module.exports = router;
