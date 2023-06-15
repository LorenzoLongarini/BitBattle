"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var sequelize_1 = require("sequelize");
var db_connection_1 = require("../db/db_connection");
var sequelize = db_connection_1.DbConnector.getConnection();
sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
}).catch(function (error) {
    console.error('Unable to connect to the database: ', error);
});
exports.User = sequelize.define("user", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 10,
    },
    role: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    isPlaying: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    modelName: 'user',
    timestamps: false,
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
});
sequelize.sync().then(function () {
    console.log('User table created successfully!');
}).catch(function (error) {
    console.error('Unable to create table : ', error);
});
