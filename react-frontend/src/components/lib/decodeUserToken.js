import { jwtDecode } from "jwt-decode";

/**
 * Decodes a user token and sets the user state if the token is valid.
 *
 * @param {Object} userToken - The user token object containing the token string.
 * @param {Function} setUser - The function to set the user state.
 *
 * @throws Will log an error and remove the user token from session storage if the token is invalid.
 */
const decodeUserToken = (userToken, setUser) => {
	if (userToken) {
		try {
			if (typeof userToken === "string") {
				try {
					userToken = JSON.parse(userToken);
				} catch (error) {
					throw new Error(error);
				}
			}

			if (!userToken.token) {
				throw new Error("Token not found in userToken object");
			}

			const decodedToken = jwtDecode(userToken.token);

			if (decodedToken.exp * 1000 > Date.now()) {
				setUser(decodedToken.user);
			} else {
				sessionStorage.removeItem("userToken");
			}
		} catch (error) {
			console.error("Failed to pass token:", error);
			sessionStorage.removeItem("userToken");
		}
	}
};

export default decodeUserToken;
