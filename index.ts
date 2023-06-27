var express = require('express');
import { Request, Response } from "express";
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
import { getUserTokens, login, createUser, getAllGames, createGame, insertMoveSingle, getStatus, insertMoveAi, insertMoveMultiplayer, getAllUsers, getGamePdf, getStats, getTurn, getClassification, insertMove } from './controller/controller';
import { updateTokens } from './controller/admin_controller';
import { checkIsAdmin } from './middleware/admin_middleware'
import { checkJwt } from "./middleware/jwt_middleware";
import { checkGameCreatorAi } from "./middleware/game_middleware";
import { checkEmail } from "./middleware/email_middlware";
import { checkPassword } from "./middleware/password_middleware";
import { getMoves } from "./services/stats_service";
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
var path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("L\'applicazione typescript è stata avviata con successo");
});

app.post("/login", jsonParser, (req: Request, res: Response) => {
    login(req, res);
});

app.get("/user/all", jsonParser, (req: Request, res: Response) => {
    getAllUsers(req, res);
});

app.post("/user/classification", jsonParser, (req: Request, res: Response) => {
    getClassification(req, res);
});

app.get("/user/tokens", jsonParser, (req: Request, res: Response) => {
    getUserTokens(req, res);
});

app.put('/admin', jsonParser, checkIsAdmin, (req: Request, res: Response) => {
    updateTokens(req, res)
})

app.post("/register", jsonParser, checkEmail, checkPassword, (req: Request, res: Response) => {
    createUser(req, res);
});

app.get("/games", (req: any, res: any) => {
    getAllGames(req, res);
});

app.post("/newgame", jsonParser, checkJwt, (req: Request, res: Response) => {
    createGame(req, res);
});

app.post("/game/:gameid/move/multiplayer", jsonParser, checkJwt, (req: Request, res: Response) => {
    insertMoveMultiplayer(req, res);
});

app.post("/game/:gameid/move/single", jsonParser, checkJwt, (req: Request, res: Response) => {
    insertMoveSingle(req, res);
});

app.post("/game/:gameid/move/ai", jsonParser, checkJwt, checkGameCreatorAi, (req: Request, res: Response) => {
    insertMoveAi(req, res);
});

app.post("/game/:gameid/move", jsonParser, checkJwt, (req: Request, res: Response) => {
    insertMove(req, res);
});

app.post("/game/:gameid/status", jsonParser, checkJwt, (req: Request, res: Response) => {
    getStatus(req, res);
});

app.get("/user/stats", jsonParser, checkJwt, (req: Request, res: Response) => {
    getStats(req, res);
});

app.get("/games/pdf",checkJwt, (req: Request, res: Response) => {
    getGamePdf(req, res);
});

app.post("/game/:gameid/turn", jsonParser, checkJwt, (req: Request, res: Response) => {
    getTurn(req, res);
});

app.post("/game/:gameid/moves", jsonParser, checkJwt, (req: Request, res: Response) => {
    getMoves(req, res);
});



app.listen(PORT, HOST, () => {
    console.log(`server is running on PORT ${PORT}`);
});