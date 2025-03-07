import express, { Request, Response } from "express";
import { Convert } from "easy-currencies";
import QRCode from "qrcode";
import multer from "multer";
import sharp from "sharp";
import archiver from 'archiver';
import fs from "fs";
import Logging from "./lib/Logging.js";

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
        fs.unlink(req.file.path, () => { }); // Cleanup uploaded file
    } catch (err) {
        Logging.logCritical("[FAVICON] Failed miserably trying to generate the favicons: " + err.toString());
    }
});

app.post('/convert', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.post('/compress', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.post('/zip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.post('/unzip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});


app.use((req: Request, res: Response) => {
    res.status(404).send('Theres nothing here.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});