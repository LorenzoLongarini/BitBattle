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
        pdf.pipe(stream);
        pdf.fontSize(12).text(JSON.stringify(stats), 5, 10);
        pdf.end();
        stream.on('finish', () => {
            res.download('/usr/src/app/pdf/file.pdf', 'file.pdf', (err) => {
                if (err) {
                    statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.PdfUnable);
                } else {
                    statusMessage.getStatusMessage(CustomStatusCodes.OK, res, Messages200.PdfSuccess);
                }
            });
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
