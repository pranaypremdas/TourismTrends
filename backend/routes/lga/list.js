let express = require("express");
let router = express.Router();

/**
 * @swagger
 * /lga/list:
 *   get:
 *     summary: Retrieve all LGAs
 *     tags: [Trend Data]
 *     description: Retrieve all LGAs
 *     security: []
 *     responses:
 *       200:
 *         description: A list of LGAs
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
 *                 retrivedAt:
 *                   type: string
 *             example:
 *               error: false
 *               message: Success
 *               results:
 *                 - id: 1
 *                   name: "Cairns"
 *                 - id: 2
 *                   name: "Gold Coast"
 *               retrivedAt: "01/01/2021 12:00:00"
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
router.get("/", async (req, res) => {
	try {
		let lgas = await req.db("lgas");
		if (lgas.length > 0) {
			res.status(200).json({
				error: false,
				message: "Success",
				results: lgas,
				retrivedAt: new Date().toLocaleString(),
			});
			return;
		}
	} catch (error) {
		res.fiveHundred(error);
		return;
	}
});

module.exports = router;
