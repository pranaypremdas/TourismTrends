const knexConfig = require("./knexFile");
const knex = require("knex")(knexConfig);

module.exports = (req, res, next) => {
	try {
		req.db = knex;
		next();
	} catch (error) {
		next(error);
	}
};
