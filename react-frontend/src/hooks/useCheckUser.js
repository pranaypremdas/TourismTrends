import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Custom hook to check the user's authentication status.
 *
 * This hook retrieves the user token from session storage, decodes it, and checks its validity.
 * If the token is valid, it sets the user state with the decoded user information.
 * If the token is invalid or expired, it removes the token from session storage.
 *
 * @param {Function} setUser - Function to set the user state.
 */
const useCheckUser = (setUser) => {
	useEffect(() => {
		const userToken = sessionStorage.getItem("userToken");
		if (userToken) {
			try {
				const decodedToken = jwtDecode(userToken.token);
				if (decodedToken.exp * 1000 > Date.now()) {
					console.log(decodedToken);
					setUser(decodedToken.user);
				} else {
					sessionStorage.removeItem("userToken");
				}
			} catch (error) {
				console.error("Invalid token:", error);
				sessionStorage.removeItem("userToken");
			}
		}
	}, [setUser]);
};

export default useCheckUser;
