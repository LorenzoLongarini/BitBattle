var express = require('express');
import { Request, Response } from "express";
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
import { getUserTokens, login, createUser, getAllGames, createGame, getAllUsers, getGamePdf, getStats, getClassification, insertMove, getMoves, downloadMoves, getGameInfo } from './controller/controller';
import { updateTokens } from './controller/admin_controller';
import { checkIsAdmin } from './middleware/admin_middleware'
import { checkJwt } from "./middleware/jwt_middleware";
import { checkGamePlayer, checkGridSize, checkMove, checkShipFormat } from "./middleware/game_middleware";
import { checkEmail } from "./middleware/email_middlware";
import { checkPassword } from "./middleware/password_middleware";
import { checkTokensBody } from "./middleware/tokens_middleware";
import { checkClafficationType } from "./middleware/classification_middleware";
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
var path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Home
 */

app.get("/", (req: Request, res: Response) => {
    res.send("Effettua il login per iniziare a giocare");
});

/**
 * Effettua il login e restituisce il jwt associato all'utente
 */

app.post("/login", jsonParser, checkEmail, checkPassword, (req: Request, res: Response) => {
    login(req, res);
});

/**
 * Registra un nuovo utente
 */

app.post("/register", jsonParser, checkEmail, checkPassword, (req: Request, res: Response) => {
    createUser(req, res);
});

/**
 * Restituisce i token associati ad un utente
 */

app.get("/user/tokens", checkJwt, (req: Request, res: Response) => {
    getUserTokens(req, res);
});

/**
 * Restituisce la classifica dei giocatori
 */

app.post("/user/classification", jsonParser, checkClafficationType, (req: Request, res: Response) => {
    getClassification(req, res);
});

/**
 * Restituisce le statistiche di un giocatore
 */

app.post("/user/stats", checkJwt, (req: Request, res: Response) => {
    getStats(req, res);
});

/**
 * Effettua il download delle statistiche
 */

app.get("/user/stats/download", checkJwt, (req: Request, res: Response) => {
    getGamePdf(req, res);
});

/**
 * Restituisce tutti i giocatori
 */

app.get("/user/all", (req: Request, res: Response) => {
    getAllUsers(req, res);
});

/**
 * Modifica i token di un utente
 */

app.put('/admin', jsonParser, checkIsAdmin, checkEmail, checkTokensBody, (req: Request, res: Response) => {
    updateTokens(req, res)
})

/**
 * Restituisce tutti i game
 */

app.get("/games", (req: any, res: any) => {
    getAllGames(req, res);
});

/**
 * Crea un nuovo game
 */

app.post("/game/create", jsonParser, checkJwt, checkShipFormat, checkGridSize, (req: Request, res: Response) => {
    createGame(req, res);
});

/**
 * Restituisce le informazioni di un particolare game
 */

app.get("/game/:gameid", jsonParser, checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    getGameInfo(req, res);
});

/**
 * Effettua la mossa in un particolare game
 */

app.post("/game/:gameid/move", jsonParser, checkJwt, checkGamePlayer, checkMove, (req: Request, res: Response) => {
    insertMove(req, res);
});

/**
 * Restituisce le mosse di un particolare game
 */

app.get("/game/:gameid/moves", checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    getMoves(req, res);
});

/**
 * Restituisce le mosse di un particolare game ed effettua il download in json
 */

app.get("/game/:gameid/moves/download", checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    downloadMoves(req, res);
});

app.listen(PORT, HOST, () => {
    console.log(`server is running on PORT ${PORT}`);
});