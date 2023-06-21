 CREATE DATABASE bitbattledb;
 \c bitbattledb

 CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,2),
      isadmin BOOLEAN,   
      isplaying BOOLEAN,
      points INTEGER
 );

 CREATE TABLE game(
      game_id SERIAL PRIMARY KEY,
      players JSON,
      name VARCHAR(15),
      grid_size INTEGER,
      ships JSON,
      possible_moves JSON,
      moves JSON,
      status VARCHAR(15),
      winner VARCHAR(25),
      score JSON

  ); 

INSERT INTO users (email, password, tokens, isadmin, isplaying, points) VALUES
 ('loris@bitbattle.it','bitbattle',10.00,true,false, 13),
 ('lorenzo@bitbattle.it','bitbattle1',10.00,false,false, 26);

INSERT INTO game (players, name, grid_size, ships, possible_moves,  moves, status, winner, score) VALUES
 ('[{"player1": "loris@bitbattle.it"}, {"player2": "lorenzo@bitbattle.it"}]', 'game_1',  2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": false}, {"move": [1, 2], "ship": true}, {"move": [2, 1], "ship": false}, {"move": [2, 2], "ship": true}]',   
 '[{"move": [1, 1], "hit": false, "player": "loris@bitbattle.it"}, {"move": [1, 2], "hit": true, "player": "lorenzo@bitbattle.it"}, {"move": [2, 1], "hit": false, "player": "loris@bitbattle.it"}]', 
 'started', 'lorenzo@bitbattle.it', '[{"loris@bitbattle.it": 1, "lorenzo@bitbattle.it": 15}]' ),
 ('[{"player1": "loris@bitbattle.it"}, {"player2": "lorenzo@bitbattle.it"}]','game_2',  2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": false}, {"move": [1, 2], "ship": true}, {"move": [2, 1], "ship": false}, {"move": [2, 2], "ship": true}]',   
 '[{"move": [2, 1], "hit": false, "player": "lorenzo@bitbattle.it"}, {"move": [1, 2], "hit": true, "player": "loris@bitbattle.it"}]', 
 'started', 'loris@bitbattle.it', '[{"loris@bitbattle.it": 12, "lorenzo@bitbattle.it": 11}]' );