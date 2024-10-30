module.exports = {
	client: "mysql2",
	connection: {
		host: "127.0.0.1",
		database: "movies",
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	},
};
