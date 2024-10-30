/**
 * Retrieves movie data from the OMDB API based on the provided IMDB ID.
 * @param {string} id - The IMDB ID of the movie.
 * @returns {Promise<Array>} - An array containing A promise (that resolves to the fetched data) and any error that occurred during the fetch (or null if no error).
 */
async function getOMDBMoviesByIMDBid(id) {
	try {
		const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		let response = await fetch(url, options);
		let data = await response.json();

		return [data, null];
	} catch (e) {
		console.error(e);
		return [null, e];
	}
}

module.exports = getOMDBMoviesByIMDBid;
