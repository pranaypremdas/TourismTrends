import postRequest from "../lib/postRequest";
import decodeUserToken from "../lib/decodeUserToken";

const handleLogin = async (
	email,
	password,
	setLoading,
	setFormError,
	setUser,
	navigate
) => {
	setLoading(true);
	setFormError(null);

	const [data, error] = await postRequest(
		"user/login",
		{
			email,
			password,
		},
		false
	);

	if (error) {
		setFormError(error);
	} else {
		// data gets saved to local session storage
		if (data && data.token) {
			sessionStorage.setItem("userToken", JSON.stringify(data));
			decodeUserToken(data, setUser);
		}
		navigate("/");
	}

	setLoading(false);
};

export default handleLogin;
