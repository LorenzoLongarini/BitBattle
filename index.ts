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

app.get("/", (req: Request, res: Response) => {
    res.send("Effettua il login per iniziare a giocare");
});

app.post("/login", jsonParser, checkEmail, checkPassword, (req: Request, res: Response) => {
    login(req, res);
});

app.post("/register", jsonParser, checkEmail, checkPassword, (req: Request, res: Response) => {
    createUser(req, res);
});

app.get("/user/tokens", checkJwt, (req: Request, res: Response) => {
    getUserTokens(req, res);
});

app.post("/user/classification", jsonParser, checkClafficationType, (req: Request, res: Response) => {
    getClassification(req, res);
});

app.post("/user/stats", checkJwt, (req: Request, res: Response) => {
    getStats(req, res);
});

app.get("/user/stats/download", checkJwt, (req: Request, res: Response) => {
    getGamePdf(req, res);
});

app.get("/user/all", (req: Request, res: Response) => {
    getAllUsers(req, res);
});

app.put('/admin', jsonParser, checkIsAdmin, checkEmail, checkTokensBody, (req: Request, res: Response) => {
    updateTokens(req, res)
})

app.get("/games", (req: any, res: any) => {
    getAllGames(req, res);
});

app.post("/game/create", jsonParser, checkJwt, checkShipFormat, checkGridSize, (req: Request, res: Response) => {
    createGame(req, res);
});

app.get("/game/:gameid", jsonParser, checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    getGameInfo(req, res);
});

app.post("/game/:gameid/move", jsonParser, checkJwt, checkGamePlayer, checkMove, (req: Request, res: Response) => {
    insertMove(req, res);
});

app.get("/game/:gameid/moves", checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    getMoves(req, res);
});

app.get("/game/:gameid/moves/download", checkJwt, checkGamePlayer, (req: Request, res: Response) => {
    downloadMoves(req, res);
});

app.listen(PORT, HOST, () => {
    console.log(`server is running on PORT ${PORT}`);
});