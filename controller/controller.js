"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
// import { generateJwt } from '../services/jwt';
var jwt_1 = require("../services/jwt");
// const express = require('express');
var login = function (req, res) {
    return (0, jwt_1.generateJwt)(req, res);
};
exports.login = login;
