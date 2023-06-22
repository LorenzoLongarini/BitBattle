import { DataTypes } from 'sequelize';
import { DbConnector } from '../db/db_connection';


const sequelize = DbConnector.getConnection();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

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
    }
},
    {
        modelName: 'game',
        timestamps: false,
        freezeTableName: true,
        createdAt: true,
        updatedAt: true,
    }
);

sequelize.sync().then(() => {
    console.log('Game table created successfully!');
}).catch((error: any) => {
    console.error('Unable to create table : ', error);
});