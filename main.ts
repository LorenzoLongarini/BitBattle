'use strict';
import express, { Application } from 'express';
import * as path from 'path';
const bodyParser = require('body-parser');

const applicazione: Application = express();
applicazione.use(express.json());
//controlla se il payload risulta essere non formato in maniera corretta
applicazione.use((err: Error, req: any, res: any, next: any) => {

    next();
});
const PORT = 8080;
const HOST = '0.0.0.0';


/**
 * rotta utilizzata per verificare se l'applicazione è stata avviata in modo corretto
 */
applicazione.get('/', function (req: any, res: any) {
    res.send('L\'applicazione è stata avviata correttamente')
});

applicazione.listen(PORT, HOST)
// console.log('Il server è in ascolto sulla porta '+PORT.toString())