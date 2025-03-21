/**
 * @swagger
 * /currency:
 *   get:
 *     summary: Convert one currency to another
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: Currency code to convert from (e.g., USD, EUR)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: Currency code to convert to (e.g., USD, EUR)
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         required: true
 *         description: The amount of currency to convert
 *     responses:
 *       200:
 *         description: Successfully converted currency amount
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Error during currency conversion
 */
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

/**
 * @swagger
 * /compress:
 *   post:
 *     summary: Upload a file to compress it
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Compressed file returned
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: No file uploaded or unsupported file type
 *       500:
 *         description: Error during compression
 */
/**
 * @swagger
 * /zip:
 *   post:
 *     summary: Upload multiple files to compress them into a ZIP archive
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Compressed zip file returned
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Error during zip creation
 */
/**
 * @swagger
 * /unzip:
 *   post:
 *     summary: Upload a ZIP file to extract its contents
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: List of URLs to the extracted files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: URL to the extracted file
 *       400:
 *         description: No file uploaded or no valid files extracted
 *       500:
 *         description: Error during ZIP extraction
 */

export default {};
