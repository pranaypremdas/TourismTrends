module.exports = (req, res, next) => {
	res.fiveHundred = (error) => {
		console.log(error);
		res.status(500).json({
			error: true,
			message: `Internal server error. ${error.message}`,
		});
		return;
	};
	next();
};
