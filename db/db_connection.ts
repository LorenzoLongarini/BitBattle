import { Sequelize } from 'sequelize';

const mysql = require("sqlite3");


//TODO: add env file
export class DbConnector {
    private static instance: DbConnector;
    private sequelizer: Sequelize;
    private constructor() {
        this.sequelizer = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
        });
    }
    public static getConnection(): Sequelize {
        if (!DbConnector.instance) {
            this.instance = new DbConnector();
        }
        return DbConnector.instance.sequelizer;
    }
}