import express, { Request, Response } from "express";
import { Convert } from "easy-currencies";
import QRCode from "qrcode";
import multer from "multer";
import sharp from "sharp";
import archiver from 'archiver';
import fs from "fs";
import AdmZip from 'adm-zip';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';
import { fileTypeFromBuffer } from "file-type";
import Logging from "./lib/Logging.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./lib/swaggerConfig.js";
import imagemin from 'imagemin';
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import path from "path";
import unzipper from "unzipper";
import crypto from "crypto";
import cors from "cors";

const app = express();
const publicDir = "public/"
var upload = multer({ dest: 'uploads/' });
app.use(cors());

interface CurrencyRequest {
    from: string,
    to: string,
    amount: number,
}

function isCurrencyRequest(arg: any): arg is CurrencyRequest {
    return (
        arg &&
        typeof arg.from === 'string' &&
        typeof arg.to === 'string' &&
        typeof arg.amount === 'string'
    );
}

app.get('/currency', async (req: Request, res: Response) => {
    if (!isCurrencyRequest(req.query)) {
        res.status(400).send("The query you sent does NOT match the expected query. Please try again!");
        Logging.logWarning("[CURRENCY] Invalid query parameters");
        return;
    }
    const requestedPayload: CurrencyRequest = req.query;

    try {
        const converted = await Convert(requestedPayload.amount).from(requestedPayload.from).to(requestedPayload.to);
        if (Number.isNaN(converted)) {
            res.sendStatus(500);
            Logging.logError("[CURRENCY] Conversion failed due to invalid result");
            return;
        }
        res.status(200).send(converted.toString());
        Logging.logInfo("[CURRENCY] Successfully served /currency");
    } catch (err) {
        res.status(500).send("An error occurred while converting the currency.");
        Logging.logCritical("[CURRENCY] Conversion failed: " + err.toString());
    }
});

app.get('/currencyList', async (req: Request, res: Response) => {
    try {
        const convert = await Convert().from("USD").fetch();
        const isoCodes = Object.keys(convert.rates);
        res.status(200).send(isoCodes);
        Logging.logInfo("[CURRENCY_LIST] Successfully served /currencyList");
    } catch (err) {
        res.status(500).send("An error occurred while fetching currency list.");
        Logging.logError("[CURRENCY_LIST] Error fetching currency list: " + err.toString());
    }
});

interface QRCodeRequest {
    string: string
}

function isQRCodeRequest(arg: any): arg is QRCodeRequest {
    return (
        arg &&
        typeof arg.string === 'string'
    );
}

app.get('/qrcode', async (req: Request, res: Response) => {
    if (!isQRCodeRequest(req.query)) {
        res.status(400).send("The query you sent does NOT match the expected query. Please try again!");
        Logging.logWarning("[QRCODE] Invalid query parameters");
        return;
    }
    try {
        const url = await QRCode.toDataURL(req.query.string);
        res.status(200).send(url.toString());
        Logging.logInfo("[QRCODE] Successfully served /qrcode");
    } catch (err) {
        res.status(500).send(err);
        Logging.logError("[QRCODE] Failed to generate QR code: " + err.toString());
    }
});

const faviconUploads = upload.single('file');
app.post('/favicon', faviconUploads, async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).send('No file uploaded');
        Logging.logWarning("[FAVICON] No file uploaded");
        return;
    }
    const archive = archiver('zip');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="favicons.zip"');

    try {
        archive.pipe(res);
        await sharp(req.file.path)
            .resize(32, 32)
            .toFormat("png")
            .toBuffer()
            .then(data => {
                archive.append(data, { name: `favicon.ico` });
            })
            .catch(err => {
                Logging.logError("[FAVICON] Couldn't generate favicon.ico: " + err.toString());
            });

        await sharp(req.file.path)
            .resize(48, 48)
            .toFormat("png")
            .toBuffer()
            .then(data => {
                archive.append(data, { name: `favicon-48x48.png` });
            })
            .catch(err => {
                Logging.logError("[FAVICON] Couldn't generate favicon-48x48.png: " + err.toString());
            });

        await sharp(req.file.path)
            .resize(180, 180)
            .toFormat("png")
            .toBuffer()
            .then(data => {
                archive.append(data, { name: `apple-touch-icon.png` });
            })
            .catch(err => {
                Logging.logError("[FAVICON] Couldn't generate apple-touch-icon.png: " + err.toString());
            });

        await sharp(req.file.path)
            .resize(192, 192)
            .toFormat("png")
            .toBuffer()
            .then(data => {
                archive.append(data, { name: `site.webmanifest` });
            })
            .catch(err => {
                Logging.logError("[FAVICON] Couldn't generate site.webmanifest: " + err.toString());
            });

        await sharp(req.file.path)
            .resize(512, 512)
            .toFormat("png")
            .toBuffer()
            .then(data => {
                archive.append(data, { name: `favicon-512x512.png` });
            })
            .catch(err => {
                Logging.logError("[FAVICON] Couldn't generate favicon-512x512.png: " + err.toString());
            });

        await archive.finalize();
        Logging.logInfo("[FAVICON] Successfully served /favicon");
        fs.unlink(req.file.path, () => { });
    } catch (err) {
        Logging.logCritical("[FAVICON] Failed to generate favicons: " + err.toString());
    }
});

const gifUpload = upload.array('files');
app.post('/gif', gifUpload, async (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
        Logging.logError("[GIF] No files uploaded");
        return res.status(400).send('No files uploaded');
    }

    const images: Buffer[] = [];
    const allowedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];

    // Check each uploaded file
    await Promise.all(req.files.map(async (file: express.Multer.File) => {
        const buffer = fs.readFileSync(file.path);
        const type = await fileTypeFromBuffer(buffer);

        if (type && allowedImageTypes.includes(type.ext)) {
            images.push(buffer);
        } else {
            Logging.logError(`[GIF] Invalid file type: ${file.originalname}`);
        }
    }));

    if (images.length === 0) {
        Logging.logError("[GIF] No valid images found in uploaded files!");
        return res.status(400).send('No valid images found in uploaded files!');
    }

    const firstImage = await loadImage(images[0]);
    const { width, height } = firstImage;
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Disposition', 'attachment; filename="output.gif"');

    // Pipe the GIF directly to the response
    encoder.createWriteStream().pipe(res);

    const delay = req.query.delay ? parseInt(req.query.delay as string) : 200;
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(delay);
    encoder.setQuality(0);

    // Add each image buffer to the GIF
    for (const imageBuffer of images) {
        const img = await loadImage(imageBuffer);
        ctx.drawImage(img, 0, 0, width, height);
        encoder.addFrame(ctx);
    }

    encoder.finish();
    Logging.logInfo("[GIF] Successfully served /gif");

    // Clean up the uploaded files
    res.on('finish', () => {
        req.files.forEach((file: express.Multer.File) => {
            fs.unlink(file.path, () => { });
        });
        Logging.logInfo("[GIF] Cleaned up uploaded files");
    });
});


const compressUpload = upload.single("file");
app.post("/compress", compressUpload, async (req: Request, res: Response) => {
    if (!req.file) {
        Logging.logError("[COMPRESS] No file uploaded");
        return res.status(400).send("No file uploaded");
    }

    const supportedTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (!supportedTypes.includes(ext)) {
        fs.unlink(req.file.path, () => { });
        Logging.logError("[COMPRESS] Unsupported file type");
        return res.status(400).send("Unsupported file type");
    }

    try {
        const compressedFiles = await imagemin([req.file.path], {
            destination: req.file.destination,
            plugins: [
                imageminMozjpeg({ quality: 75 }),
                imageminPngquant({ quality: [0.75, 0.9] }),
                imageminGifsicle({ optimizationLevel: 2 }),
                imageminSvgo()
            ]
        });

        if (compressedFiles.length === 0) {
            Logging.logError("[COMPRESS] Compression failed");
            return res.status(500).send("Compression failed");
        }

        const compressedFilePath = compressedFiles[0].destinationPath;

        // Set the correct Content-Type based on the file extension
        let contentType = '';
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            default:
                contentType = 'application/octet-stream';
                break;
        }

        res.setHeader('Content-Type', contentType);

        res.download(compressedFilePath, `compressed_${req.file.originalname}`, () => {
            fs.unlink(req.file.path, () => { });
            fs.unlink(compressedFilePath, () => { });
            Logging.logInfo("[COMPRESS] Cleaned up temporary files");
        });

        Logging.logInfo("[COMPRESS] Successfully served /compress");
    } catch (err) {
        Logging.logError(`[COMPRESS] Error: ${err}`);
        res.sendStatus(500);
    }
});

const zipUpload = upload.array("files");
app.post("/zip", zipUpload, async (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
        Logging.logError("[ZIP] No files uploaded");
        return res.status(400).send("No files uploaded");
    }

    // Create a zip archive
    const zipFileName = "compressed_files.zip";
    const zipStream = archiver("zip", { zlib: { level: 9 } });

    res.attachment(zipFileName);
    zipStream.pipe(res);

    // Add each uploaded file to the zip
    req.files.forEach((file: express.Multer.File) => {
        zipStream.append(fs.createReadStream(file.path), { name: file.originalname });
    });

    zipStream.finalize();

    // Cleanup uploaded files after the response
    zipStream.on("end", () => {
        req.files.forEach((file: express.Multer.File) => {
            fs.unlink(file.path, () => { });
        });
        Logging.logInfo("[ZIP] Cleaned up uploaded files");
    });

    // Handle errors
    zipStream.on("error", (err) => {
        fs.unlinkSync(zipFileName); // Optional cleanup if zip creation fails
        Logging.logError(`[ZIP] Error: ${err.message}`);
        res.status(500).send(`Error creating zip file: ${err.message}`);
    });
});

const unzipUpload = upload.single("file");
app.post('/unzip', unzipUpload, async (req: Request, res: Response) => {
    if (!req.file) {
        Logging.logError("[UNZIP] No file uploaded");
        return res.status(400).send("No file uploaded");
    }

    const zipFilePath = req.file.path;
    const unzipStream = fs.createReadStream(zipFilePath).pipe(unzipper.Parse());

    const urls: string[] = []; // To store the URLs of extracted files
    const filesExtracted: Set<string> = new Set(); // To track files that are extracted

    // Make sure the public directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    unzipStream.on('entry', (entry) => {
        const fileName = entry.path;
        const fileType = entry.type; // 'File' or 'Directory'

        if (fileType === 'File') {
            // Generate a random hash for the filename
            const randomHash = crypto.randomBytes(16).toString('hex');
            const fileExt = path.extname(fileName); // Preserve original file extension
            const newFileName = `${randomHash}${fileExt}`; // New random filename
            const outputPath = path.join(publicDir, newFileName);

            const outputStream = fs.createWriteStream(outputPath);
            entry.pipe(outputStream);

            outputStream.on('finish', () => {
                const fileUrl = `/public/${newFileName}`; // URL for the file
                urls.push(fileUrl);
                filesExtracted.add(newFileName);

                // Schedule deletion after 5 minutes (300,000 ms)
                setTimeout(() => {
                    fs.unlink(outputPath, (err) => {
                        if (err) {
                            Logging.logError(`[UNZIP] Failed to delete file: ${newFileName}`);
                        } else {
                            Logging.logInfo(`[UNZIP] Deleted file: ${newFileName}`);
                        }
                    });
                }, 300000); // 5 minutes in milliseconds
            });
        } else {
            entry.autodrain(); // Ignore directories
        }
    });

    unzipStream.on('close', () => {
        // Cleanup the uploaded zip file after extraction
        fs.unlink(zipFilePath, () => { });

        // Return the list of URLs
        if (filesExtracted.size > 0) {
            Logging.logInfo("[UNZIP] Successfully extracted files");
            res.status(200).json({ files: urls });
        } else {
            Logging.logError("[UNZIP] No valid files extracted");
            res.status(400).send("No valid files extracted");
        }
    });

    unzipStream.on('error', (err) => {
        fs.unlink(zipFilePath, () => { });
        Logging.logError(`[UNZIP] Error: ${err.message}`);
        res.status(500).send(`Error extracting zip file: ${err.message}`);
    });
});


// Serve the public directory statically
app.use('/public', express.static(publicDir));

app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req: Request, res: Response) => {
    res.status(404).send('Theres nothing here.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});