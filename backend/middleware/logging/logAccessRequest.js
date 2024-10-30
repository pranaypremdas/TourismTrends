const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");
const morgan = require("morgan");

// Ensure the logs directory exists
const logsDir = path.join(__dirname, "../../logs");
fs.mkdirSync(logsDir, { recursive: true });

// Create a write stream (in append mode)
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: logsDir,
});

// Setup the logger
module.exports = morgan("combined", { stream: accessLogStream });
