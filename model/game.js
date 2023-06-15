"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = require("../db/db_connection");
const sequelize = db_connection_1.DbConnector.getConnection();
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
exports.game = sequelize.define('game', {
    mod: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false
    },
    grid_size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    n_ship: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    type_ship: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    move: {
        type: sequelize_1.DataTypes.TEXT
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false
    },
    result: {
        type: sequelize_1.DataTypes.TEXT
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    modelName: 'game',
    timestamps: true,
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
});
sequelize.sync().then(() => {
    console.log('Game table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
