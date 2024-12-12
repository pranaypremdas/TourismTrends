/**
 * Calculates metadata statistics (minimum, maximum, mean, and standard deviation) for a given key in an array of objects.
 *
 * @param {Array<Object>} data - The array of objects containing the data.
 * @param {string} key - The key to extract values from each object in the array.
 * @returns {Object|null} An object containing the calculated metadata (min, max, mean, stdDev) or null if no valid values are found.
 */
const calculateMetaData = (data, key) => {
	const values = data.map((item) => item[key]).filter((v) => v != null);
	if (!values.length) return null;

	const sum = values.reduce((a, b) => a + b, 0);
	const mean = sum / values.length;
	const min = Math.min(...values);
	const max = Math.max(...values);
	const variance =
		values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
	const stdDev = Math.sqrt(variance);

	return { min, max, mean, stdDev };
};

export default calculateMetaData;
