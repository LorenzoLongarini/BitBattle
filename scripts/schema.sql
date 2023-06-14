CREATE DATABASE bitbattledb;
\c bitbattledb
CREATE TABLE users(
    id SERIAL PRIMARY KEY,  
    email VARCHAR(25),
    password VARCHAR(25),
    token NUMERIC,
    role INTEGER,   
    isPlaying BOOLEAN
);



INSERT INTO users(email, password, token,role,isPlaying ) VALUES
('lorenzo@bitbattle.it','bitbattle',10,0,false),
('loris@bitbattle.it','bitbattle',10,1,false);