var express = require('express');
import { Request, Response } from "express";
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
import { getUserTokens, login, createUser, getAllGames, createGame, insertMoveSingle, getStatus, insertMoveAi, insertMoveMultiplayer, getAllUsers, getGamePdf, getStats, getTurn } from './controller/controller';
import { updateTokens } from './controller/admin_controller';
import { checkIsAdmin } from './middleware/admin_middleware'
import { checkJwt } from "./middleware/jwt_middleware";
import { checkGameCreatorAi } from "./middleware/game_middleware";
import { checkEmail } from "./middleware/email_middlware";
import { checkPassword } from "./middleware/password_middleware";
import { getClassificationService, getMoves } from "./services/stats_service";
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
    getClassificationService(req, res);
});

app.get("/user/tokens", jsonParser, (req: any, res: any) => {
    getUserTokens(req, res);
});

app.put('/admin', jsonParser, checkIsAdmin, (req: any, res: any) => {
    updateTokens(req, res)
})

app.post("/register", jsonParser, checkEmail, checkPassword, (req: any, res: any) => {
    createUser(req, res);
});

app.get("/games", (req: any, res: any) => {
    getAllGames(req, res);
});

app.post("/newgame", jsonParser, checkJwt, (req: any, res: any) => {
    createGame(req, res);
});

app.post("/move/multiplayer", jsonParser, checkJwt, (req: any, res: any) => {
    insertMoveMultiplayer(req, res);
});

app.post("/move/single", jsonParser, checkJwt, (req: any, res: any) => {
    insertMoveSingle(req, res);
});

app.post("/move/ai", jsonParser, checkJwt, checkGameCreatorAi, (req: any, res: any) => {
    insertMoveAi(req, res);
});

app.post("/game/status", jsonParser, checkJwt, (req: any, res: any) => {
    getStatus(req, res);
});

app.get("/user/stats", jsonParser, checkJwt, (req: any, res: any) => {
    getStats(req, res);
});

app.get("/games/pdf", (req: any, res: any) => {
    getGamePdf(req, res);
});

app.post("/game/turn", jsonParser, checkJwt, (req: any, res: any) => {
    getTurn(req, res);
});

app.post("/game/moves", jsonParser, checkJwt, (req: any, res: any) => {
    getMoves(req, res);
});



app.listen(PORT, HOST, () => {
    console.log(`server is running on PORT ${PORT}`);
});