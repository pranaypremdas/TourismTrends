/**
 * Middleware to check if the user is a site admin.
 *
 * This middleware checks if the user's role is "admin" or if the user's client_id is "1".
 * If neither condition is met, it responds with a 403 status and an error message.
 * Otherwise, it calls the next middleware function.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.role - The role of the user.
 * @param {string} req.user.client_id - The client ID of the user.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function isSiteAdmin(req, res, next) {
	if (req.user.role !== "admin" && req.user.client_id !== "1") {
		res.status(403).json({
			error: true,
			message: "You are not authorized",
		});
		return;
	}

	next();
}

/**
 * Middleware to check if the user has either "admin" or "client_admin" role.
 * If the user does not have the required role, it responds with a 403 status and an error message.
 * Otherwise, it passes control to the next middleware function.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object attached to the request.
 * @param {string} req.user.role - The role of the user.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function isEitherAdmin(req, res, next) {
	if (req.user.role !== "admin" && req.user.role !== "client_admin") {
		res.status(403).json({
			error: true,
			message: "You are not authorized",
		});
		return;
	}

	next();
}

module.exports = { isSiteAdmin, isEitherAdmin };
