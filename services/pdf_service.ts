import pdfkit from 'pdfkit';
import fs from 'fs';
import { Request, Response } from "express";
import { generateStats } from './stats_service';
import { MessageFactory } from '../status/messages_factory';
import { CustomStatusCodes, Messages400 } from '../status/status_codes';
import { decodeJwt } from './jwt_service';

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
                    console.error('Errore durante il download del file PDF:', err);
                } else {
                    console.log('File PDF scaricato con successo.');
                }
            });
        });

    } catch (error) {
        console.log(error)
    }
}

export async function getGamesPdfService(req: Request, res: Response) {
    try {
        let jwtBearerToken = req.headers.authorization;
        let jwtDecode = jwtBearerToken ? decodeJwt(jwtBearerToken) : null;
        let jwtPlayerEmail: any;
        if (jwtDecode && jwtDecode.email) {
            jwtPlayerEmail = jwtDecode.email;
            let stats = await generateStats(req, jwtPlayerEmail)
            generatePDF(res, stats)
        } else {
            statusMessage.getStatusMessage(CustomStatusCodes.INTERNAL_SERVER_ERROR, res, Messages400.UserNotFound);
        }

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}
