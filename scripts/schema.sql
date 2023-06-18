 CREATE DATABASE bitbattledb;
 \c bitbattledb
 CREATE TABLE users(
      id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,2),
      isadmin BOOLEAN,   
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

 INSERT INTO users (email, password, tokens, isadmin, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10.00,true,false);

 INSERT INTO users (email, password, tokens, isadmin, isplaying) VALUES
 ('lorenzo@bitbattle.it','bitbattle1',10.00,false,false);