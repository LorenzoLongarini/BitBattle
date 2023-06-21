import { DataTypes } from 'sequelize';
import { DbConnector } from '../db/db_connection';

const sequelize = DbConnector.getConnection();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

export const user = sequelize.define("users", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tokens: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isadmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isplaying: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER
    }

}, {
    modelName: 'user',
    timestamps: false,
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error: any) => {
    console.error('Unable to create table : ', error);
});
