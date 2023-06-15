"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
// import express, { Application, Request, Response, NextFunction } from "express";
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var controller_1 = require("./controller/controller");
var app = express();
var path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send("L\'applicazione typescript è stata avviata con successo");
});
app.post("/login", jsonParser, function (req, res) {
    // res.send("TS App is Running");
    (0, controller_1.login)(req, res);
});
var PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log("server is running on PORT ".concat(PORT));
});
