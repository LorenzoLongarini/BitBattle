 CREATE DATABASE bitbattledb;
 \c bitbattledb
 CREATE TABLE users(
      id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      token NUMERIC,
      role INTEGER,   
      isplaying BOOLEAN
 );
--  CREATE TABLE games(
--       mod ENUM,
--       grid_size INTEGER,
--       n_ship INTEGER,
--       type_ship ENUM,
--       id SERIAL PRIMARY KEY,
--       move TEXT,
--       status ENUM,
--       result TEXT,
--       score INTEGER
--   ); 

 INSERT INTO users (email, password, token, role, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10,1,false);
