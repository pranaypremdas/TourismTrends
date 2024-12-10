let express = require("express");
let router = express.Router();

const { swaggerUI, swaggerSpec } = require("./api-docs/swagger.js");

const {
	verifyJwtAndAddUser,
} = require("../middleware/authentication/verifyJwtAndAddUser.js");
const {
	isSiteAdmin,
	isEitherAdmin,
} = require("../middleware/authentication/isAdmin.js");

const {
	rejectInvalidUrlQueryParams,
	requireEmailAndPassword,
} = require("../middleware/requestTests");

/**
 *  SETUP ROUTES
 */

// setup 500 error handling (attaches to all routes)
router.use("*", require("../middleware/error/fiveHundred"));

// Reject URL parameters for all routes
router.use("*", rejectInvalidUrlQueryParams);

// POST Request: Define a simple route to check if our server works
router.get("/helloWorld", verifyJwtAndAddUser, (_, res) => {
	res.send("Hello World!");
});

/** SWAGGER DOCS */

// GET Request: Swagger UI setup
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/** TREND DATA */

// POST Request: retrieve tourism trends
router.use("/trends", verifyJwtAndAddUser, require("./trends/publicData"));

// GET Request: retrieve tourism trend types
router.use(
	"/trend/types",
	verifyJwtAndAddUser,
	require("./trends/types/trendTypesGet.js")
);

// POST Request: Add a new tourism trend type
router.use(
	"/trend/types/add",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./trends/types/trendTypesAdd.js")
);

/** USER TREND DATA */

// GET Request: Retrieve user uploaded data
router.use(
	"/trends/user/uploads",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./trends/user/getUploads.js")
);

// POST Request: Retrieve user uploaded data
router.use(
	"/trends/user/get",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./trends/user/getData.js")
);

// POST Request: Add user data
router.use(
	"/trends/user/add",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./trends/user/addData.js")
);

// POST Request: Delete user data
router.use(
	"/trends/user/delete",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./trends/user/deleteData.js")
);

// LGA list
router.use("/lga/list", require("./lga/list"));

/** SUBSCRIPTION */

// POST Request: A new client registration
router.use("/subscribe", require("./client/newSubscription.js"));

// POST Request: Renew a subscription
router.use("/renew", require("./client/renewSubscription.js"));

/** ADMIN ROUTES */

// GET Request: List of new clients
router.use(
	"/client/new/list",
	verifyJwtAndAddUser,
	isSiteAdmin,
	require("./client/listNewClients.js")
);

// POST update a client #TODO
router.use(
	"/client/new/process",
	verifyJwtAndAddUser,
	isSiteAdmin,
	require("./client/procesNewClient.js")
);

// GET active client list
router.use(
	"/client/list",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./client/listClients")
);

// GET Request: Get User List
router.use(
	"/user/list",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./user/listUsers.js")
);

/** AUTHENTICATION */

// POST user registration
router.use(
	"/user/register",
	verifyJwtAndAddUser,
	isEitherAdmin,
	require("./user/register.js")
);

// POST Request: User login
router.use("/user/login", requireEmailAndPassword, require("./user/login.js"));

router.use("/user/first", require("./user/firstUser.js"));

/** 404 */

// Display 404 page
router.use("*", require("./404/404"));

module.exports = router;
