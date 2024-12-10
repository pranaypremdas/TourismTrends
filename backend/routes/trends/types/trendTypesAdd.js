let express = require("express");
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trend Types
 *   description: The Trend Types endpoint manages tourism trend types in the database.
 */

/**
 * @swagger
 * /trend/types/add:
 *   post:
 *     summary: Add a new tourism trend type
 *     tags: [Trend Types]
 *     description: Adds a new tourism trend type to the database and returns the updated list of trend types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newType:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Occupancy"
 *                   description:
 *                     type: string
 *                     example: "Average historical occupancy"
 *     responses:
 *       200:
 *         description: Trend type added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 retrievedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: "Trend type added successfully"
 *               results:
 *                 - id: 1
 *                   name: "Occupancy"
 *                   description: "Average historical occupancy"
 *                 - id: 2
 *                   name: "Daily Rate"
 *                   description: "Average daily rate"
 *               retrievedAt: "01/01/2021 12:00:00"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               error: true
 *               message: "Invalid request parameters"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               error: true
 *               message: "Internal Server Error"
 */

router.post("/", async (req, res) => {
	try {
		console.log(req.body);
		const { newType } = req.body;

		if (
			!newType ||
			typeof newType !== "object" ||
			!newType.name ||
			!newType.description
		) {
			res.status(400).json({
				error: true,
				message: "Invalid request parameters",
			});
			return;
		}

		// Insert the new trend type into the trend_types table
		await req.db("trend_types").insert({
			name: newType.name,
			description: newType.description,
		});

		// Query the trend_types table for all trend types
		let trendTypes = await req
			.db("trend_types")
			.select("id", "name", "description");

		res.status(200).json({
			error: false,
			message: "Trend type added successfully",
			results: trendTypes,
			retrievedAt: new Date().toLocaleString(),
		});
	} catch (error) {
		res.status(500).json({
			error: true,
			message: "Internal Server Error",
		});
	}
});

module.exports = router;
