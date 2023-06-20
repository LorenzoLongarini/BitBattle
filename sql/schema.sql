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
 ('game_1', '1vs1', 2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": false}, {"move": [1, 2], "ship": true}, {"move": [2, 1], "ship": false}, {"move": [2, 2], "ship": true}]',   
 '[{"move": [1, 1], "hit": false, "player": "A"}, {"move": [1, 2], "hit": true, "player": "B"}, {"move": [2, 1], "hit": false, "player": "A"}]', 
 'started', '[{"Winner":"B", "Loser":"A"}]', '[{"A": 1, "B": 15}]' ),
 ('game_2', '1vs1', 2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": false}, {"move": [1, 2], "ship": true}, {"move": [2, 1], "ship": false}, {"move": [2, 2], "ship": true}]',   
 '[{"move": [2, 1], "hit": false, "player": "B"}, {"move": [1, 2], "hit": true, "player": "A"}]', 
 'started', '[{"Winner":"A", "Loser":"B"}]', '[{"A": 12, "B": 11}]' );