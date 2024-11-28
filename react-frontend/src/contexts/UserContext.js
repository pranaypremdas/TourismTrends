import React, { createContext, useState, useEffect } from "react";
import decodeUserToken from "../components/lib/decodeUserToken";
import Loading from "../components/Loading";

/**
 * Context to manage user-related data and state.
 *
 * @type {React.Context}
 */
const UserContext = createContext();

/**
 * UserProvider component that provides user context to its children.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will receive the user context.
 * @returns {JSX.Element} The UserContext provider with user state and setUser function.
 *
 * @example
 * <UserProvider>
 *   <YourComponent />
 * </UserProvider>
 */
const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let token = sessionStorage.getItem("userToken");
		decodeUserToken(token, setUser);
		setLoading(false);
	}, [setUser]);

	if (loading) {
		return <Loading />;
	}

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
