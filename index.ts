var express = require('express');
import { Request, Response } from "express";
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
import { getUserTokens, login, createUser, getAllGames, createGame, insertMove, getStatus } from './controller/controller';
import { updateTokens } from './controller/admin_controller';
import { checkIsAdmin } from './middleware/admin_middleware'
import { checkJwt } from "./middleware/jwt_middleware";
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

app.get("/user/tokens", jsonParser, (req: any, res: any) => {
    getUserTokens(req, res);
});

app.put('/admin', jsonParser, checkIsAdmin, (req: any, res: any) => {
    updateTokens(req, res)
})

app.post("/register", jsonParser, (req: any, res: any) => {
    createUser(req, res);
});

app.get("/games", (req: any, res: any) => {
    getAllGames(req, res);
});

app.post("/newgame", jsonParser, checkJwt, (req: any, res: any) => {
    createGame(req, res);
});

app.post("/domove", jsonParser, checkJwt, (req: any, res: any) => {
    insertMove(req, res);
});

app.post("/game/status", jsonParser, checkJwt, (req: any, res: any) => {
    getStatus(req, res);
});

app.listen(PORT, HOST, () => {
    console.log(`server is running on PORT ${PORT}`);
});