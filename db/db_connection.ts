import { Sequelize } from 'sequelize';


//TODO: add env file
/**
 * Classe per la connessione al database.
 * Utilizza il pattern Singleton per garantire una sola istanza di connessione.
 */
export class DbConnector {
    private static instance: DbConnector;
    private sequelizer: any;
    private constructor() {
        this.sequelizer = new Sequelize('bitbattledb', 'postgres', 'postgres', {
            host: 'db',
            dialect: 'postgres',
        });

    }

    /**
     * Ottiene l'istanza della connessione al database.
     * Restituisce l'oggetto Sequelize per la connessione.
     *
     * @returns L'istanza della connessione al database.
     */
    public static getConnection(): any {
        if (!DbConnector.instance) {
            this.instance = new DbConnector();
        }
        return DbConnector.instance.sequelizer;
    }
}