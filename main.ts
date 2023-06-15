var express = require('express');
// import express, { Application, Request, Response, NextFunction } from "express";
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
const { controller } = require('../controller/controller.ts');
const app = express();
var path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    // res.send("TS App is Running");
});

app.post("/login", jsonParser, (req: Request, res: Response) => {
    controller.login(req, res);
    // res.send("TS App is Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});