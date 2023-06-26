import pdfkit from 'pdfkit';
import fs from 'fs';
import { Request, Response } from "express";
import { generateStats } from './stats_service';
import { MessageFactory } from '../status/messages_factory';
import { CustomStatusCodes, Messages200, Messages500 } from '../status/status_codes';
import { getJwtEmail } from './jwt_service';

let statusMessage: MessageFactory = new MessageFactory();


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

export async function getGamesPdfService(req: Request, res: Response) {
    try {
        let jwtPlayerEmail = getJwtEmail(req);
        let stats = await generateStats(req, jwtPlayerEmail)
        generatePDF(res, stats)
    } catch (error) {
        statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages500.InternalServerError);
    }
}
