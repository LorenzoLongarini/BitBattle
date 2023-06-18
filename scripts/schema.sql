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

 CREATE TABLE game(
      mod VARCHAR(15),
      grid_size INTEGER,
      n_ship INTEGER,
      type_ship VARCHAR(15),
      id SERIAL PRIMARY KEY,
      move TEXT,
      status VARCHAR(15),
      result TEXT,
      score TEXT
  ); 

 INSERT INTO users (email, password, tokens, role, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10,1,false),
 ('lorenzo@bitbattle.it','bitbattle',10,1,false);


 INSERT INTO game (mod, grid_size, n_ship, type_ship, move, status, result, score) VALUES
 ('1vs2', 10, 3, 'size_2', '[{"A":["1","1"], "B":["1","4"], "C":["2","1"]}]', 'started', '', '[{"A":1, "B":15, "C":8}]' );
