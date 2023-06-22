 CREATE DATABASE bitbattledb;
 \c bitbattledb

 CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,3),
      isadmin BOOLEAN,   
      isplaying BOOLEAN,
      points INTEGER
 );

 CREATE TABLE game(
      game_id SERIAL PRIMARY KEY,
      player0 VARCHAR(25),
      player1 VARCHAR(25),
      player2 VARCHAR(25),
      name VARCHAR(15),
      grid_size INTEGER,
      ships JSON,
      possible_moves JSON,
      moves JSON,
      status VARCHAR(15),
      winner VARCHAR(25),
      score JSON,
      mod VARCHAR(4)

  ); 

INSERT INTO users (email, password, tokens, isadmin, isplaying, points) VALUES
 ('loris@bitbattle.it','bitbattle',10.00,true,true, 13),
 ('lorenzo@bitbattle.it','bitbattle1',10.00,false,true, 26),
 ('prova@bitbattle.it','bitbattle2',10.00,true,true, 1);

INSERT INTO game (player0,player1, player2, name, grid_size, ships, possible_moves,  moves, status, winner, score) VALUES
 ('loris@bitbattle.it','','', 'game_1',  2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": 0, "owner":""}, {"move": [1, 2], "ship": 1, "owner":"loris@bitbattle.it"}, {"move": [2, 1], "ship": 0, "owner":""}, {"move": [2, 2], "ship": 1, "owner":"lorenzo@bitbattle.it"}]',   
 '[{"move": [1, 1], "hit": false, "player": "loris@bitbattle.it"}, {"move": [1, 2], "hit": true, "player": "lorenzo@bitbattle.it"}, {"move": [2, 1], "hit": false, "player": "loris@bitbattle.it"}]', 
 'started', 'lorenzo@bitbattle.it', '[{"loris@bitbattle.it": 1, "lorenzo@bitbattle.it": 15}]' ),
 ('loris@bitbattle.it','','','game_2',  2, '[{"size1": 3}, {"size2": 2 }, {"size3": 3}]',
 '[{"move": [1, 1], "ship": 0, "owner":""}, {"move": [1, 2], "ship": 1, "owner":"loris@bitbattle.it"}, {"move": [2, 1], "ship": 0, "owner":""}, {"move": [2, 2], "ship": 1, "owner":"lorenzo@bitbattle.it"}]',   
 '[{"move": [2, 1], "hit": false, "player": "lorenzo@bitbattle.it"}, {"move": [1, 2], "hit": true, "player": "loris@bitbattle.it"}]', 
 'finished', 'loris@bitbattle.it', '[{"loris@bitbattle.it": 12, "lorenzo@bitbattle.it": 11}]' );
