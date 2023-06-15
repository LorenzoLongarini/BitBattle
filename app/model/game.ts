import { DataTypes } from 'sequelize';
import { DbConnector } from '../db/db_connection';


const sequelize = DbConnector.getConnection();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

export const game = sequelize.define('game', {
    mod: {
        type: DataTypes.ENUM,
        allowNull: false
    },
    grid_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    n_ship: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_ship: {
        type: DataTypes.ENUM,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    move: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false
    },
    result: {
        type: DataTypes.TEXT
    },
    score: {
        type: DataTypes.INTEGER,
    }
},
    {
        modelName: 'game',
        timestamps: true,
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