function rejectInvalidUrlQueryParams(req, res, next) {
	if (Object.keys(req.query).length > 0) {
		return res.status(400).json({
			error: true,
			message: `Invalid query parameters: ${Object.keys(
				req.query
			)}. Query parameters are not permitted.`,
		});
	}
	next();
}

function requireEmailAndPassword(req, res, next) {
	if (
		Object.keys(req.body).length === 0 ||
		!req.body.email ||
		!req.body.password ||
		!req.body.email[0] ||
		!req.body.password[0]
	) {
		return res.status(400).json({
			error: true,
			message: "Request body incomplete, both email and password are required",
		});
	}
	next();
}

module.exports = {
	rejectInvalidUrlQueryParams,
	requireEmailAndPassword,
};
