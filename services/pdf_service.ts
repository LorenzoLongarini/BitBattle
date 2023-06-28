import pdfkit from 'pdfkit';
import fs from 'fs';
import { Request, Response } from "express";
import { generateStats } from './stats_service';
import { MessageFactory } from '../status/messages_factory';
import { CustomStatusCodes, Messages200, Messages500 } from '../status/status_codes';
import { getJwtEmail } from './jwt_service';

let statusMessage: MessageFactory = new MessageFactory();

/**
 * Genera un file PDF contenente le statistiche fornite e lo rende disponibile per il download.
 * 
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 * @param stats - Le statistiche da inserire nel file PDF.
 */
export function generatePDF(res: Response, stats: any) {
    try {
        let stream = fs.createWriteStream('/usr/src/app/pdf/file.pdf');
        let pdf = new pdfkit();
        const logoPath = '/usr/src/app/assets/logo/bitbattle.png';
        pdf.pipe(stream);
        pdf.image(logoPath, 150, 10, { fit: [300, 300], align: 'center' })
            .rect(430, 15, 100, 100);
        pdf.fontSize(15).text("email: ", 50, 340);
        pdf.fontSize(15).text(JSON.stringify(stats.email), 220, 340);
        pdf.fontSize(15).text("played: ", 50, 360);
        pdf.fontSize(15).text(JSON.stringify(stats.played), 220, 360);
        pdf.fontSize(15).text("win: ", 50, 380);
        pdf.fontSize(15).text(JSON.stringify(stats.win), 220, 380);
        pdf.fontSize(15).text("lose: ", 50, 400);
        pdf.fontSize(15).text(JSON.stringify(stats.lose), 220, 400);
        pdf.fontSize(15).text("totalMoves: ", 50, 420);
        pdf.fontSize(15).text(JSON.stringify(stats.totalMoves), 220, 420);
        pdf.fontSize(15).text("maxMovesPerGame: ", 50, 440);
        pdf.fontSize(15).text(JSON.stringify(stats.maxMovesPerGame), 220, 440);
        pdf.fontSize(15).text("minMovesPerGames: ", 50, 460);
        pdf.fontSize(15).text(JSON.stringify(stats.minMovesPerGame), 220, 460);
        pdf.fontSize(15).text("standardDeviation: ", 50, 480);
        pdf.fontSize(15).text(JSON.stringify(stats.standardDeviation), 220, 480);
        pdf.fontSize(15).text("mean: ", 50, 500);
        pdf.fontSize(15).text(JSON.stringify(stats.mean), 220, 500);
        pdf.end();
        stream.on('finish', () => {
            res.download('/usr/src/app/pdf/file.pdf', 'file.pdf', (err) => { });
        });
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}

/**
 * Gestisce la richiesta di generazione di un file PDF contenente le statistiche del giocatore.
 * 
 * @param req - L'oggetto di richiesta HTTP.
 * @param res - L'oggetto di risposta HTTP utilizzato per inviare la risposta al client.
 */
export async function getGamesPdfService(req: Request, res: Response) {
    try {
        let jwtPlayerEmail = getJwtEmail(req);
        let stats = await generateStats(jwtPlayerEmail, "", "", res);
        generatePDF(res, stats);
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}
