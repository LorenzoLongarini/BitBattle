var express = require('express');
// import express, { Application, Request, Response, NextFunction } from "express";
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
import { login } from './controller/controller';
const app = express();
var path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
    res.send("L\'applicazione typescript è stata avviata con successo");
});

app.post("/login", jsonParser, (req: any, res: any) => {
    // res.send("TS App is Running");
    login(req, res);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});