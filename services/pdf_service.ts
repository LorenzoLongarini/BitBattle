import PDFDocument from 'pdfkit';
import fs from 'fs';
import { findAllGames } from '../db/queries/games_queries';
import { Request, Response } from "express";

export function generatePDF(res: Response, data: any) {
    try {
        const outputPath: any = process.env.PWD;
        console.log(outputPath)
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('../pdf/file.pdf'));
        //  = fs.createWriteStream(outputPath);

        //doc.pipe(stream);

        doc.fontSize(12).text("data", 5, 10);

        doc.end();

        console.log(`Il file PDF è stato generato con successo: ${outputPath}`);
        res.json({ esito: "Il file PDF è stato generato con successo" });
    } catch (error) {
        console.log(error)
    }

    // stream.on('error', (error) => {
    //     console.error('Si è verificato un errore durante la generazione del file PDF:', error);
    // });
}


export async function getGamesPdfService(req: Request, res: Response) {
    try {
        const game: any = await findAllGames();
        // res.json({ game: game });
        generatePDF(res, game)

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}