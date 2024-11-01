module.exports = {
	client: "mysql2",
	connection: {
		host: "localhost",
		database: process.env.MYSQL_DATABASE,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	},
};
