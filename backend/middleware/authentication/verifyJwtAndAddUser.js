const e = require("express");
const jwt = require("jsonwebtoken");

async function verifyJwtAndAddUser(req, res, next) {
	if (
		!("authorization" in req.headers) ||
		!req.headers.authorization.match(/^Bearer /)
	) {
		res.status(401).json({
			error: true,
			message: "Authorization header ('Bearer token') not found",
		});
		return;
	}
	const token = req.headers.authorization.replace(/^Bearer /, "");
	try {
		// verify the token, note the user email is stored in the token
		let jwtVerified = jwt.verify(token, process.env.JWT_SECRET);

		// get the user from the database
		let user = await req
			.db("users")
			.select(
				"users.id as id",
				"users.client_id as client_id",
				"users.email as email",
				"users.role as role",
				"clients.c_name as client_name",
				"clients.c_type as client_type",
				req.db.raw("GROUP_CONCAT(client_lgas.lga_id) as lga_ids"),
				"users.updated_at",
				"users.created_at"
			)
			.join("clients", "users.client_id", "clients.id")
			.join("client_lgas", "users.client_id", "client_lgas.client_id")
			.where("users.email", jwtVerified.user.email)
			.groupBy(
				"users.id",
				"users.client_id",
				"users.email",
				"users.role",
				"clients.c_name",
				"clients.c_type",
				"users.updated_at",
				"users.created_at"
			)
			.first();

		// check if the user exists, to confirm the user hasn't been deleted
		if (!user) {
			res.status(401).json({
				error: true,
				message: "User not found",
				email: jwtVerified.user.email,
			});
			return;
		}

		// add the user to the request object
		req.user = {
			id: user.id,
			email: user.email,
			role: user.role,
			client_id: user.client_id,
			client_name: user.client_name,
			client_type: user.client_type,
			lga_id: user.lga_ids.split(",").map(Number),
			updated_at: user.updated_at,
			created_at: user.created_at,
			jwt: jwtVerified,
		};
	} catch (e) {
		if (e.name === "TokenExpiredError") {
			res.status(401).json({ error: true, message: "JWT token has expired" });
		} else if (e.name === "JsonWebTokenError") {
			res.status(401).json({ error: true, message: "Invalid JWT token" });
		} else {
			res.status(500).json({ error: true, message: "Internal server error" });
		}
		return;
	}
	next();
}

module.exports = { verifyJwtAndAddUser };
