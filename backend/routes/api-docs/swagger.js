const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.2",
		info: {
			title: "Tourism Trends API",
			version: "1.0.0",
			description:
				"The API endpoints and their usage are described in detail below.",
			termsOfService: "http://swagger.io/terms/",
			contact: {
				email: "glenjplayer@gmail.com",
			},
			license: {
				name: "Apache 2.0",
				url: "http://www.apache.org/licenses/LICENSE-2.0.html",
			},
		},
		servers: [
			{
				url: "http://localhost:5000",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./routes/**/*.js"], // Path to the API docs, including subdirectories
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
	swaggerUI,
	swaggerSpec,
};
