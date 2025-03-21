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

const app = express();
var upload = multer({ dest: 'uploads/' });


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
        return;
    }
    const requestedPayload: CurrencyRequest = req.query;

    const converted = await Convert(requestedPayload.amount).from(requestedPayload.from).to(requestedPayload.to);
    if (Number.isNaN(converted)) {
        res.sendStatus(500);
        return;
    }
    res.status(200).send(converted.toString());
    Logging.logInfo("[CURRENCY] Successfully served /currency");
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
        return;
    }
    QRCode.toDataURL(req.query.string)
        .then(url => {
            res.status(200).send(url.toString());
            Logging.logInfo("[QRCODE] Successfully served /qrcode");
            return;
        })
        .catch(err => {
            res.status(500).send(err);
            return;
        })
});

const faviconUploads = upload.single('favicon');
app.post('/favicon', faviconUploads, async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
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
                Logging.logError("[FAVICON] Couldnt generate favicon.ico: " + err.toString());
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
        fs.unlink(req.file.path, () => { }); // Cleanup uploaded file
    } catch (err) {
        Logging.logCritical("[FAVICON] Failed miserably trying to generate the favicons: " + err.toString());
    }
});

const gifUploads = upload.single('gif');
app.post('/gif', gifUploads, async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    if (req.file.mimetype != 'application/zip') {
        return res.status(400).send('No valid ZIP file uploaded!');
    }

    const zip = new AdmZip(req.file.path);
    var zipEntries = zip.getEntries();
    const images: Buffer[] = [];
    const allowedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];

    await Promise.all(zipEntries.map(async (zipEntry) => {
        const buffer = zipEntry.getData();
        const type = await fileTypeFromBuffer(buffer);

        if (type && allowedImageTypes.includes(type.ext)) {
            images.push(buffer);
        }
    }));

    if (images.length === 0) {
        return res.status(400).send('No PNG images found in ZIP!');
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

    // Clean up the uploaded file
    res.on('finish', () => {
        fs.unlinkSync(req.file.path);
    });
});

const uploadFile = upload.single("file");
app.post("/compress", uploadFile, async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const supportedTypes = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (!supportedTypes.includes(ext)) {
        fs.unlink(req.file.path, () => { });
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
            return res.status(500).send("Compression failed");
        }

        const compressedFilePath = compressedFiles[0].destinationPath;

        res.download(compressedFilePath, `compressed_${req.file.originalname}`, () => {
            fs.unlink(req.file.path, () => { });
            fs.unlink(compressedFilePath, () => { });
        });
        Logging.logInfo("[COMPRESS] Successfully served /compress");
    } catch (err) {
        Logging.logError(`[COMPRESS] Error: ${err}`);
        res.sendStatus(500);
    }
});



app.post('/zip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.post('/unzip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

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