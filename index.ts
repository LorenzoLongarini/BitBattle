var express = require('express');
// import express, { Application, Request, Response, NextFunction } from "express";
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
import { getUserTokens, login, createUser } from './controller/controller';
const app = express();
var path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
    res.send("L\'applicazione typescript è stata avviata con successo");
});

app.post("/login", jsonParser, (req: any, res: any) => {
    login(req, res);
});

app.get("/user/tokens", jsonParser, (req: any, res: any) => {
    getUserTokens(req, res);
});

app.put('/admin', jsonParser, (req: any, res: any) => {
    getUserTokens(req, res)
})

app.post("/register", (req: any, res: any) => {
    createUser(req, res);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});