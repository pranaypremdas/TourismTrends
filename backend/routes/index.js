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

// POST Define a simple route to check if our server works
router.get("/helloWorld", verifyJwtAndAddUser, (_, res) => {
	res.send("Hello World!");
});

// GET Swagger UI setup
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// POST get tourism trends
router.use("/trends", verifyJwtAndAddUser, require("./trends/publicData"));

// POST get user data
router.use(
	"/user/trends/get",
	verifyJwtAndAddUser,
	require("./user/trends/getData")
);

// POST add user data
router.use(
	"/user/trends/add",
	verifyJwtAndAddUser,
	require("./user/trends/addData")
);

//  POST delete user data
router.use(
	"/user/trends/delete",
	verifyJwtAndAddUser,
	require("./user/trends/deleteData")
);

// POST add a new client #TODO
// router.use("/client/add", verifyJwtAndAddUser, require("./client/addClient"));

// POST update a client #TODO
// router.use(
// 	"/client/update",
// 	verifyJwtAndAddUser,
// 	require("./client/updateClient")
// );

// POST delete a client #TODO
// router.use(
// 	"/client/delete",
// 	verifyJwtAndAddUser,
// 	require("./client/deleteClient")
// );

// GET client list
router.use(
	"/client/list",
	verifyJwtAndAddUser,
	require("./client/listClients")
);

// POST user registration
router.use(
	"/user/register",
	verifyJwtAndAddUser,
	requireEmailAndPassword,
	require("./user/register")
);

// POST user login
router.use("/user/login", requireEmailAndPassword, require("./user/login"));

// POST user list
router.use("/user/list", verifyJwtAndAddUser, require("./user/listUsers"));

// LGA list
router.use("/lga/list", require("./lga/list"));

// Display 404 page
router.use("*", require("./404/404"));

module.exports = router;
