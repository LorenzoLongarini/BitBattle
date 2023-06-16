import { DataTypes } from 'sequelize';
import { DbConnector } from '../db/db_connection';

const sequelize = DbConnector.getConnection();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

export const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 10,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isplaying: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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
