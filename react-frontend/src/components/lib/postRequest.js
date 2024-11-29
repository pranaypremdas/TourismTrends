import getToken from "./getToken";

/**
 * postRequest is an asynchronous function that sends a POST request to the specified route with the provided body.
 *
 * @param {string} route - The API endpoint route to send the POST request to.
 * @param {Object} body - The request payload to be sent in the POST request.
 * @param {Boolean} [requireToken] - A boolean that indicates if the request requires a token.
 * @returns {Promise<Array>} A promise that resolves to an array containing the results, and error.
 *
 * @example
 * const [results, error] = postRequest("user/register", { email: "test@test.com", password: "password" }, false);
 */
async function postRequest(route, body, requireToken = true) {
	try {
		if (!route || !body) {
			throw new Error("Route and body are required");
		}

		let baseUrl = "http://localhost:5000";
		const url = `${baseUrl}/${route}`;
		let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};

		if (requireToken) {
			let bearerToken = getToken();
			options.headers.Authorization = "Bearer " + bearerToken;
		}

		let response = await fetch(url, options);

		// network error
		if (!response.ok) {
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
		console.log(`Error calling ${route}:`, error.message);
		return [null, error.message];
	}
}

export default postRequest;
