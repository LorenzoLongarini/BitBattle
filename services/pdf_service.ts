import PDFDocument from 'pdfkit';
import fs from 'fs';
import { findAllGames } from '../db/queries/games_queries';

export function generatePDF(data: any) {

    const outputPath: any = process.env.PWD;
    console.log(outputPath)
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(12).text(JSON.stringify(data, null, 2));

    doc.end();

    console.log(`Il file PDF è stato generato con successo: ${outputPath}`);

    stream.on('error', (error) => {
        console.error('Si è verificato un errore durante la generazione del file PDF:', error);
    });
}


export async function getGamesPdfService(req: Request, res: Response) {
    try {
        const game: any = await findAllGames();
        // res.json({ game: game });
        generatePDF(game)

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}