

import { Sequelize } from 'sequelize';


//TODO: add env file
export class DbConnector {
    private static instance: DbConnector;
    private sequelizer: Sequelize;
    private constructor() {
        this.sequelizer = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            dialect: 'postgres',
        });

    }

    public static getConnection(): Sequelize {
        if (!DbConnector.instance) {
            this.instance = new DbConnector();
        }
        return DbConnector.instance.sequelizer;
    }
}