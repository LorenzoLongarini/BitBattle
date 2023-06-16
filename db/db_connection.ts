import { Sequelize } from 'sequelize';


//TODO: add env file
export class DbConnector {
    private static instance: DbConnector;
    private sequelizer: any;
    private constructor() {
        this.sequelizer = new Sequelize('bitbattledb', 'postgres', 'postgres', {
            host: 'db',
            dialect: 'postgres',
        });

    }

    public static getConnection(): any {
        if (!DbConnector.instance) {
            this.instance = new DbConnector();
        }
        return DbConnector.instance.sequelizer;
    }
}