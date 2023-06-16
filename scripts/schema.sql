 CREATE DATABASE bitbattledb;
 \c bitbattledb
 CREATE TABLE users(
      id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,2),
      role INTEGER,   
      isplaying BOOLEAN
 );
--  CREATE TABLE games(
--       id SERIAL PRIMARY KEY,
--       mod ENUM ('1vs1','1vs2','1vsIA'),
--       grid_size INTEGER,
--       n_ship INTEGER,
--       type_ship ENUM ('size 2','size 3', 'size 4'),
--       move TEXT,
--       status ENUM (),
--       result TEXT,
--       score INTEGER
--   ); 

 INSERT INTO users (email, password, tokens, role, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10,1,false);

--  INSERT INTO games (mod, grid_size, n_ship, type_ship, move, status, result, score) VALUES
--  ()
