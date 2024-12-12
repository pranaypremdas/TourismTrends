/**
 * Filters and processes row data for year-on-year visualization based on the selected region.
 *
 * @param {number} selectedRegion - The ID of the selected region.
 * @param {string} selectedTrendType - The selected trend type.
 * @param {Array} rowData - The array of data rows to be processed.
 * @param {Array} lgas - The array of local government areas (LGAs) with their details.
 * @param {Function} setChartData - The function to set the processed chart data.
 */
const filterYearOnYear = (
	selectedRegion,
	selectedTrendType,
	rowData,
	lgas,
	setChartData
) => {
	// Process data for year-on-year visualization
	const groupedByYear = {};
	let selectedRegionName = lgas.find(
		(lga) => lga.id === Number(selectedRegion)
	).lga_name;

	rowData
		.filter((item) => item.lga_name === selectedRegionName)
		.forEach((item) => {
			const [year, month, day] = item.date.split("-");
			const key = `${month}-${day}`; // Align by month and day
			if (month !== "2" && day !== "29") {
				if (!groupedByYear[year]) groupedByYear[year] = {};
				if (!groupedByYear[year][key]) groupedByYear[year][key] = 0;
				groupedByYear[year][key] += item[selectedTrendType];
			}
		});

	const datasets = Object.entries(groupedByYear).map(([year, data]) => ({
		label: `Year ${year}`,
		data: Object.entries(data).map(([date, value]) => ({
			x: date,
			y: value,
		})),
		fill: false,
		borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
	}));

	setChartData({
		datasets,
	});
};

export default filterYearOnYear;
