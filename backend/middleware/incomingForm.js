let formidable = require("formidable");

module.exports = (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			res.status(500).json({
				error: true,
				message: `Internal server error: ${err}`,
			});
			return;
		}
		req.body = fields;
		req.files = files;
		next();
	});
};
