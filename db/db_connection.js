"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnector = void 0;
var sequelize_1 = require("sequelize");
//TODO: add env file
var DbConnector = /** @class */ (function () {
    function DbConnector() {
        this.sequelizer = new sequelize_1.Sequelize('bitbattledb', 'postgres', 'postgres', {
            host: 'db',
            dialect: 'postgres',
        });
    }
    DbConnector.getConnection = function () {
        if (!DbConnector.instance) {
            this.instance = new DbConnector();
        }
        return DbConnector.instance.sequelizer;
    };
    return DbConnector;
}());
exports.DbConnector = DbConnector;
