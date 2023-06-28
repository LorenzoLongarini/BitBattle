import { DataTypes } from 'sequelize';
import { DbConnector } from '../db/db_connection';

/**
 * Connessione al database utilizzando il modulo di connessione Sequelize.
 * Viene autenticata la connessione al database e viene gestito il risultato dell'autenticazione.
 */
const sequelize = DbConnector.getConnection();
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

/**
 * Definizione del modello "game" per la tabella del database.
 * Il modello definisce le proprietà e i tipi di dati associati alla tabella "game".
 */
export const game = sequelize.define('game', {
    game_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    player0: {
        type: DataTypes.STRING
    },
    player1: {
        type: DataTypes.STRING
    },
    player2: {
        type: DataTypes.STRING
    },
    grid_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ships: {
        type: DataTypes.JSON,
        allowNull: false
    },
    possible_moves: {
        type: DataTypes.JSON
    },
    moves: {
        type: DataTypes.JSON
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    winner: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.JSON,
    },
    mod: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.BIGINT,
    }
},
    {
        modelName: 'game',
        timestamps: false,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
    }
);

/**
 * Crea le tabelle nel database utilizzando Sequelize.
 * Viene chiamato il metodo `sync()` su `sequelize` per sincronizzare il modello definito con le tabelle effettive nel database.
 * Viene gestito il risultato della sincronizzazione.
 */
sequelize.sync().then(() => {
    console.log('Game table created successfully!');
}).catch((error: any) => {
    console.error('Unable to create table : ', error);
});