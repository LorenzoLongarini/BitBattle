 CREATE DATABASE bitbattledb;
 \c bitbattledb

 CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,  
      email VARCHAR(25),
      password VARCHAR(25),
      tokens NUMERIC(10,4),
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
      mod VARCHAR(4),
      created_at BIGINT

  ); 

INSERT INTO users (email, password, tokens, isadmin, isplaying, points) VALUES
 ('loris@bitbattle.it', 'bitbattlePA23!', 9.505, false, true, 0),
 ('lorenzo@bitbattle.it', 'bitbattle1PA23!', 8.89, false, false, 20),
 ('adriano@bitbattle.it', 'bitbattle2PA23!', 10.00, true, false, 0),
 ('user1@bitbattle.it', 'bitbattle3PA23!', 10.00, false, false, 0),
 ('user2@bitbattle.it', 'bitbattle4PA23!', 10.00, false, false, 4);

INSERT INTO game (player0,player1, player2, name, grid_size, ships, possible_moves,  moves, status, winner, score, mod, created_at) VALUES
 ('loris@bitbattle.it', '', '', 'game_1',  5, '[{"size1": 0}, {"size2":  1}, {"size3": 0}]',
 '[{"move": [1, 1], "ship": 0, "owner":""}, {"move": [1, 2], "ship": 0, "owner":""}, {"move": [1, 3], "ship": 2, "owner":"AI"}, {"move": [1, 4], "ship": 2, "owner":"AI"}, {"move": [1, 5], "ship": 0, "owner":""}, {"move": [2, 1], "ship": 0, "owner":""}, {"move": [2, 2], "ship": 0, "owner":""}, {"move": [2, 3], "ship": 0, "owner":""}, {"move": [2, 4], "ship": 0, "owner":""}, {"move": [2, 5], "ship": 0, "owner":""}, {"move": [3, 1], "ship": 0, "owner":""}, {"move": [3, 2], "ship": 0, "owner":""}, {"move": [3, 3], "ship": 0, "owner":""}, {"move": [3, 4], "ship": 0, "owner":""}, {"move": [3, 5], "ship": 0, "owner":""}, {"move": [4, 1], "ship": 0, "owner":""}, {"move": [4, 2], "ship": 0, "owner":""}, {"move": [4, 3], "ship": 0, "owner":""}, {"move": [4, 4], "ship": 0, "owner":""}, {"move": [4, 5], "ship": 0, "owner":""}, {"move": [5, 1], "ship": 2, "owner":"loris@bitbattle.it"}, {"move": [5, 2], "ship": 2, "owner":"loris@bitbattle.it"}, {"move": [5, 3], "ship": 0, "owner":""}, {"move": [5, 4], "ship": 0, "owner":""}, {"move": [5, 5], "ship": 0, "owner":""}]',   
 '[{"move": [2, 3], "hit": false, "player": "loris@bitbattle.it"}, {"move": [3, 1], "hit": false, "player": "AI"},{"move": [1, 3], "hit": true, "player": "loris@bitbattle.it"}, {"move": [1, 1], "hit": false, "player": "AI"}]', 
 'started', 'null', '[]', '1vAI', 1687730401000),
 ('lorenzo@bitbattle.it','user1@bitbattle.it','', 'game_2',  5, '[{"size1": 0}, {"size2":  1}, {"size3": 0}]',
 '[{"move": [1, 1], "ship": 2, "owner":"user1@bitbattle.it"}, {"move": [1, 2], "ship": 2, "owner":"user1@bitbattle.it"}, {"move": [1, 3], "ship": 0, "owner":""}, {"move": [1, 4], "ship": 0, "owner":""}, {"move": [1, 5], "ship": 0, "owner":""}, {"move": [2, 1], "ship": 0, "owner":""}, {"move": [2, 2], "ship": 0, "owner":""}, {"move": [2, 3], "ship": 0, "owner":""}, {"move": [2, 4], "ship": 0, "owner":""}, {"move": [2, 5], "ship": 0, "owner":""}, {"move": [3, 1], "ship": 0, "owner":""}, {"move": [3, 2], "ship": 0, "owner":""}, {"move": [3, 3], "ship": 2, "owner":"lorenzo@bitbattle.it"}, {"move": [3, 4], "ship": 0, "owner":""}, {"move": [3, 5], "ship": 0, "owner":""}, {"move": [4, 1], "ship": 0, "owner":""}, {"move": [4, 2], "ship": 0, "owner":""}, {"move": [4, 3], "ship": 2, "owner":"lorenzo@bitbattle.it"}, {"move": [4, 4], "ship": 0, "owner":""}, {"move": [4, 5], "ship": 0, "owner":""}, {"move": [5, 1], "ship": 0, "owner":""}, {"move": [5, 2], "ship": 0, "owner":""}, {"move": [5, 3], "ship": 0, "owner":""}, {"move": [5, 4], "ship": 0, "owner":""}, {"move": [5, 5], "ship": 0, "owner":""}]',   
 '[{"move": [1, 1], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user1@bitbattle.it"}, {"move": [3, 1], "hit": false, "player": "user1@bitbattle.it", "owner":""},{"move": [1, 3], "hit": false, "player": "lorenzo@bitbattle.it", "owner":""}, {"move": [2, 2], "hit": false, "player": "user1@bitbattle.it", "owner":""}, {"move": [1, 2], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user1@bitbattle.it"}]', 
 'finished', 'lorenzo@bitbattle.it', '[{"player":"lorenzo@bitbattle.it", "points": 10},{"player": "user1@bitbattle.it", "points": 0}]', '1v1', 1687816801000),
  ('lorenzo@bitbattle.it','user1@bitbattle.it','user2@bitbattle.it', 'game_3',  6, '[{"size1": 1}, {"size2":  1}, {"size3": 0}]',
 '[{"move": [1, 1], "ship": 1, "owner":"lorenzo@bitbattle.it"}, {"move": [1, 2], "ship": 0, "owner":""}, {"move": [1, 3], "ship": 0, "owner":""}, {"move": [1, 4], "ship": 0, "owner":""}, {"move": [1, 5], "ship": 0, "owner":""}, {"move": [1, 6], "ship": 2, "owner":"user2@bitbattle.it"}, {"move": [2, 1], "ship": 0, "owner":""}, {"move": [2, 2], "ship": 0, "owner":""}, {"move": [2, 3], "ship": 1, "owner":"user1@bitbattle.it"}, {"move": [2, 4], "ship": 0, "owner":""}, {"move": [2, 5], "ship": 0, "owner":""}, {"move": [2, 6], "ship": 2, "owner":"user2@bitbattle.it"}, {"move": [3, 1], "ship": 0, "owner":""}, {"move": [3, 2], "ship": 0, "owner":""}, {"move": [3, 3], "ship": 0, "owner":""}, {"move": [3, 4], "ship": 0, "owner":""}, {"move": [3, 5], "ship": 2, "owner":"lorenzo@bitbattle.it"}, {"move": [3, 6], "ship": 0, "owner":""}, {"move": [4, 1], "ship": 0, "owner":""}, {"move": [4, 2], "ship": 2, "owner":"user1@bitbattle.it"}, {"move": [4, 3], "ship": 0, "owner":""}, {"move": [4, 4], "ship": 0, "owner":""}, {"move": [4, 5], "ship": 2, "owner":"lorenzo@bitbattle.it"}, {"move": [4, 6], "ship": 0, "owner":""}, {"move": [5, 1], "ship": 0, "owner":""}, {"move": [5, 2], "ship": 2, "owner":"user1@bitbattle.it"}, {"move": [5, 3], "ship": 0, "owner":""}, {"move": [5, 4], "ship": 0, "owner":""}, {"move": [5, 5], "ship": 0, "owner":""}, {"move": [5, 6], "ship": 0, "owner":""}, {"move": [6, 1], "ship": 0, "owner":""}, {"move": [6, 2], "ship": 0, "owner":""}, {"move": [6, 3], "ship": 0, "owner":""}, {"move": [6, 4], "ship": 0, "owner":""}, {"move": [6, 5], "ship": 1, "owner":"user2@bitbattle.it"}, {"move": [6, 6], "ship": 0, "owner":""}]',   
 '[{"move": [2, 3], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user1@bitbattle.it"}, {"move": [4, 2], "hit": true, "player": "user2@bitbattle.it", "owner":"user1@bitbattle.it"}, {"move": [2, 2], "hit": false, "player": "user1@bitbattle.it", "owner":""}, {"move": [5, 2], "hit": true, "player": "user2@bitbattle.it", "owner":"user1@bitbattle.it"}, {"move": [6, 5], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user2@bitbattle.it"}, {"move": [6, 6], "hit": false, "player": "user2@bitbattle.it", "owner":""}, {"move": [1, 6], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user2@bitbattle.it"}, {"move": [3, 5], "hit": true, "player": "user2@bitbattle.it,", "owner":"lorenzo@bitbattle.it"}, {"move": [2, 6], "hit": true, "player": "lorenzo@bitbattle.it", "owner":"user2@bitbattle.it"}]', 
 'finished', 'lorenzo@bitbattle.it', '[{"player":"lorenzo@bitbattle.it", "points": 10}, {"player": "user2@bitbattle.it", "points": 4}, {"player": "user1@bitbattle.it", "points": 0}]', '1v2', 1687903201000);
