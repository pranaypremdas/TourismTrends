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
		let user = await req.db("users").where("email", jwtVerified.user.email);

		// check if the user exists, to confirm the user hasn't been deleted
		if (user.length === 0) {
			res.status(401).json({ error: true, message: "Error" });
			return;
		}
		// add the user to the request object
		req.user = {
			id: user[0].id,
			email: user[0].email,
			role: user[0].role,
			client_id: user[0].client_id,
			created_at: user[0].created_at,
			jwt: jwtVerified,
		};
	} catch (e) {
		if (e.name === "TokenExpiredError") {
			res.status(401).json({ error: true, message: "JWT token has expired" });
		} else {
			res.status(401).json({ error: true, message: "Invalid JWT token" });
		}
		return;
	}
	next();
}

module.exports = { verifyJwtAndAddUser };
