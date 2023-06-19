 CREATE DATABASE bitbattledb;
 \c bitbattledb

 CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,2),
      isadmin BOOLEAN,   
      isplaying BOOLEAN
 );

 CREATE TABLE game(
      game_id SERIAL PRIMARY KEY,
      name VARCHAR(15),
      mod VARCHAR(15),
      grid_size INTEGER,
      ships JSON,
      possible_moves JSON,
      moves JSON,
      status VARCHAR(15),
      result JSON,
      score JSON

  ); 

INSERT INTO users (email, password, tokens, isadmin, isplaying) VALUES
 ('loris@bitbattle.it','bitbattle',10.00,true,false),
 ('lorenzo@bitbattle.it','bitbattle1',10.00,false,false);

INSERT INTO game (name, mod, grid_size, ships, possible_moves,  moves, status, result, score) VALUES
 ('my_game', '1vs2', 2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": false}, {"move": [1, 2], "ship": true}, {"move": [2, 1], "ship": false}, {"move": [2, 2], "ship": true}]',   
 '[{"A": [1, 1], "hit": false}, {"B": [1, 4], "hit": false}, {"C": [2, 1], "hit": true}]', 
 'started', '[{"B":"Winner", "A":"Loser"}]', '[{"A": 1, "B": 15, "C": 8}]' );