import express, { Request, Response } from "express";

const app = express();

interface CurrencyRequest {
    from: string,
    to: string,
    amount: number,
}

app.get('/currency', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/qrcode', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/favicon', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/convert', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/compress', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/zip', async (req: Request, res: Response) => {
    res.status(501);
});

app.get('/unzip', async (req: Request, res: Response) => {
    res.status(501);
});


app.use((req: Request, res: Response) => {
    res.status(404).send('Theres nothing here. Try /search');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});