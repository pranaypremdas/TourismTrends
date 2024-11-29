/**
 * Retrieves the user token from session storage.
 *
 * @throws {Error} If the user token is not found in session storage.
 * @returns {string} The user token.
 */
const getToken = () => {
	let userToken = sessionStorage.getItem("userToken");
	if (!userToken) {
		throw new Error("Token is required");
	}
	return JSON.parse(userToken).token;
};

export default getToken;
