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

 CREATE TABLE game(
      id SERIAL PRIMARY KEY,
      mod VARCHAR(15),
      grid_size INTEGER,
      n_ship INTEGER,
      type_ship VARCHAR(15),
      moves JSON,
      status VARCHAR(15),
      result JSON,
      score JSON
  ); 

INSERT INTO users (email, password, tokens, isadmin, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10.00,true,false),
 ('lorenzo@bitbattle.it','bitbattle1',10.00,false,false);

INSERT INTO game (mod, grid_size, n_ship, type_ship, moves, status, result, score) VALUES
 ('1vs2', 10, 3, 'size_2', '[{"A": [1, 1]}, {"B": [1, 4]}, {"C": [2, 1]}]', 'started', '[{"B":"Winner", "A":"Loser"}]', '[{"A": 1, "B": 15, "C": 8}]' );
 