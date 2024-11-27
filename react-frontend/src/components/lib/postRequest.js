/**
 * postRequest is an asynchronous function that sends a POST request to the specified route with the provided body.
 *
 * @param {string} route - The API endpoint route to send the POST request to.
 * @param {Object} body - The request payload to be sent in the POST request.
 * @returns {Promise<Array>} A promise that resolves to an array containing the results, and error.
 *
 * @example
 * const [results, error] = postRequest("user/register", { email: "test@test.com", password: "password" });
 */
async function postRequest(route, body) {
	try {
		if (!route || !body) {
			throw new Error("Route and body are required");
		}

		let baseUrl = "http://localhost:5000";

		const url = `${baseUrl}/${route}`;

		// set options for login route
		let options = {};
		if (route === "user/login") {
			options = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			};
		}
		// set options for all other routes
		else {
			let userToken = sessionStorage.getItem("userToken");
			if (!userToken) {
				throw new Error("Token is required");
			}
			let bearerToken = JSON.parse(userToken).token;

			options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + bearerToken,
				},
				body: JSON.stringify(body),
			};
		}

		let response = await fetch(url, options);

		// network error
		if (!response.ok) {
			console.error(`Error calling ${route}: ${response.statusText}`);
			let errorData = await response.json();
			throw new Error(errorData.message || "Network response was not ok");
		}

		let tempResponse = await response.json();

		// server defined error
		if (tempResponse.error) {
			throw new Error(tempResponse.message);
		}

		return [tempResponse, null];
	} catch (error) {
		console.error(`Error calling ${route}:`, error.message);
		return [null, error.message];
	}
}

export default postRequest;
