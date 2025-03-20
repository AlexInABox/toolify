/**
 * @swagger
 * /qrcode:
 *   get:
 *     summary: Generate a QR code
 *     parameters:
 *       - in: query
 *         name: string
 *         schema:
 *           type: string
 *         required: true
 *         description: String to encode into a QR code
 *     responses:
 *       200:
 *         description: QR code image in data URL format
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Error generating QR code
 */

/**
 * @swagger
 * /favicon:
 *   post:
 *     summary: Upload a favicon and receive multiple favicon sizes and a webmanifest file
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               favicon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Favicon sizes and webmanifest zip file
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error generating favicons
 */

/**
 * @swagger
 * /gif:
 *   post:
 *     summary: Upload a ZIP file with images to generate a GIF
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gif:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: query
 *         name: delay
 *         schema:
 *           type: integer
 *         required: false
 *         description: Delay between frames in milliseconds (default is 200ms)
 *     responses:
 *       200:
 *         description: Generated GIF file
 *       400:
 *         description: Invalid ZIP file or no images found
 *       500:
 *         description: Error generating GIF
 */

export default {};