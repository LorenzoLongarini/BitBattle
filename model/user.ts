import { DataTypes } from 'sequelize'
import { DbConnector } from '../db/db_connection';

const sequelize = DbConnector.getConnection();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

export const User = sequelize.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isPlaying: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
