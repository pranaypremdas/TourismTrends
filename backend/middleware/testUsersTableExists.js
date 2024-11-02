module.exports = async (req, res, next) => {
	try {
		const hasUsersTable = await req.db.schema.hasTable("users");
		if (!hasUsersTable) {
			console.log("Creating users table!");
			await req.db.schema.createTable("users", (table) => {
				table.increments("id").primary();
				table.string("client_id", 255).notNullable();
				table.string("email", 255).unique().notNullable();
				table.string("hash", 60).notNullable();
				table.timestamp("created_at").defaultTo(req.db.fn.now());
			});
			console.log("Users table created successfully.");
		}
		next();
	} catch (error) {
		console.error("Error checking/creating users table:", error);
		next(error);
	}
};
