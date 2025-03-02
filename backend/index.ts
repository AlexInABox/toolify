import express, { Request, Response } from "express";
import { Convert } from "easy-currencies";

const app = express();


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

app.get('/qrcode', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.get('/favicon', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.get('/convert', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.get('/compress', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.get('/zip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});

app.get('/unzip', async (req: Request, res: Response) => {
    res.sendStatus(501);
});


app.use((req: Request, res: Response) => {
    res.status(404).send('Theres nothing here.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});