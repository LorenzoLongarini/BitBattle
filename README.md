
<div>
<p  align="center">
<img  src="https://github.com/LorenzoLongarini/BitBattle/blob/main/assets/logo/bitbattle.png">
</p>

[![Postgres](https://img.shields.io/badge/Made%20with-postgres-%23316192.svg?style=plastic&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NPM](https://img.shields.io/badge/Made%20with-NPM-%23CB3837.svg?style=plastic&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![NodeJS](https://img.shields.io/badge/Made%20with-node.js-6DA55F?style=plastic&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Made%20with-express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB)](https://expressjs.com/it/)
[![JWT](https://img.shields.io/badge/Made%20with-JWT-black?style=plastic&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Visual Studio Code](https://img.shields.io/badge/Made%20with-Visual%20Studio%20Code-0078d7.svg?style=plastic&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/Made%20with-typescript-%23007ACC.svg?style=plastic&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sequelize](https://img.shields.io/badge/Made%20with-Sequelize-52B0E7?style=plastic&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Docker](https://img.shields.io/badge/Made%20with-docker-%230db7ed.svg?style=plastic&logo=docker&logoColor=white)](https://www.docker.com/)
[![Postman](https://img.shields.io/badge/Made%20with-Postman-FF6C37?style=plastic&logo=postman&logoColor=white)](https://www.postman.com/)

  
</p>
<p  align="center">
 Indice
</p>

</p>
<p  align="center">
<a  href="#obiettivi-del-progetto">Obiettivi del progetto</a>&nbsp•
<a  href="#progettazione">Progettazione</a>&nbsp•
<a  href="#funzionamento">Funzionamento</a>&nbsp•
<a  href="#testing">Testing</a>&nbsp•
<a  href="#autori">Autori</a>
</p>
<br>
<br>
</div>

  

  

## Obiettivi del progetto

  
  
**Descrizione del progetto:**

*Le specifiche del progetto sono state fornite direttamente dal docente [*Adriano Mancini*](https://github.com/manciniadriano):*

*Si realizzi un sistema che consenta di gestire il gioco della battaglia navale. In particolare, il sistema deve prevedere la possibilità di far interagire due o tre utenti (autenticati mediante JWT) o un utente contro l’elaboratore. Ci possono essere più partite attive in un dato momento. Un utente può allo stesso tempo partecipare ad una ed una sola partita. Si chiede di sviluppare anche la possibilità di giocare contro l’elaboratore (di seguito IA). Nel caso di IA la logica può essere semplice (mosse randomiche all’interno della griglia) o tenere in considerazione lo storico delle mosse (es. cercare nei vicini); l’implementazione è carico del gruppo. Nel caso di gioco a tre player la turnazione deve essere A->B, C->A, B->C , C->B, A->C, B->A (il gioco potrebbe non essere equo)*

<p align="center">
<img  width="230" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/moves.gif">
</p>

*Dare la possibilità di creare una nuova partita specificando (codifica a scelta dello studente):*
- *Tipologia: utente contro utente o utente contro IA o utente contro 2 utenti*
- *Dimensione della griglia*
- *Numero e tipologie delle imbarcazioni*
- *L’allocazione delle imbarcazioni è randomica (fatta all’atto della creazione).*
- *email dell’avversario o email degli avversari che sarà/saranno usata/e poi per autenticare le richieste mediante token JWT*

*Per ogni partita viene addebitato un numero di token in accordo con quanto segue:*
- *0.450 all’atto della creazione*
- *0.015 per ogni mossa da parte degli utenti (anche IA)*

*Il modello può essere creato se c’è credito sufficiente ad esaudire la richiesta (se il credito durante la partita scende sotto lo zero si può continuare comunque). *

- *Creare una rotta per effettuare una mossa in una data partita verificando se questa è ammissibile o meno.*
- *Creare una rotta per valutare lo stato di una data partita (di chi è il turno, se è terminata, vincitore,…)*
- *Creare una rotta per restituire lo storico delle mosse di una data partita con la possibilità di esportare in JSON (codifica a scelta del gruppo).*
- *Creare una rotta per restituire le statistiche di un utente ed in particolare: numero partite vinte, numero di partite perse, numero totale di partite giocate, numero min, massimo, media e deviazione standard delle mosse; dare la possibilità di filtrare per date (intervallo); dare la possibilità di restituire sotto forma di JSON o PDF (libreria a scelta del gruppo). *
- *Restituire la classifica dei giocatori dando la possibilità di scegliere l’ordinamento ascendente / discendente. Questa rotta è pubblica e non deve essere autenticata.*

*Le richieste devono essere validate (es. utente che scelga un evento che non esistente, payload non corretti dal punto di vista semantico, es. griglia con dimensione nulla o negativa.).*

*Ogni utente autenticato (ovvero con JWT) ha un numero di token (valore iniziale impostato nel seed del database).*

*Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire 401 Unauthorized.*

*Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente fornendo la mail ed il nuovo “credito” (sempre mediante JWT). I token JWT devono contenere i dati essenziali.*

*Il numero residuo di token deve essere memorizzato nel db sopra citato.*

*Si deve prevedere degli script di seed per inizializzare il sistema. *

*Si chiede di utilizzare le funzionalità di middleware.* 

*Si chiede di gestire eventuali errori mediante gli strati middleware sollevando le opportune eccezioni.*

*Si chiede di commentare opportunamente il codice.*

<p align="center">
<a href="#obiettivi-del-progetto">
<img  width="30" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Progettazione

### Rotte
<table align="center">
    <thead>
        <tr>
            <th>Tipo</th>
            <th>Rotta</th>
            <th>Parametri</th>
        </tr>
    </thead>
    <tbody>
        <tr>
         <td> POST</td>
         <td> /admin</td>
         <td> email, tokens </td>
        </tr>
        <tr>
    </tbody>
 </table>

### Diagrammi UML

### Pattern utilizzati

#### MVCS

<p align="center">
<img  width="250" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/MVCS.png">
</p>

#### Singleton

<p align="center">
<img  width="450" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/singleton.png">
</p>

#### Abstract

<p align="center">
<img  width="450" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/abstract.png">
</p>

#### Factory

<p align="center">
<img  width="450" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/factory.png">
</p>

#### Middleware

<p align="center">
<img  width="450" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/middleware.png">
</p>


<p align="center">
<a href="#progettazione">
<img  width="30" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Funzionamento
  
In questa sezione, forniremo una descrizione dettagliata di ogni rotta che è stata creata. Saranno inclusi i parametri richiesti, il diagramma delle sequenze, che illustra l'interazione tra i componenti, e i risultati restituiti da ciascuna rotta.

### POST: /login

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"email":"loris@bitbattle.it",
	"password":"bitbattlePA23!"
}
~~~

Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /login
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkEmail()
middleware ->>- app : next()
app ->>+ middleware: checkPassword()
middleware ->>- app : next()
app ->>+ controller: login()
controller->>+ service: generateJwtService()
service ->>+ model: jwt.sign()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il token jwt generato con email e password dell'utente:
~~~
{
	"OK": {
		jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvcmlzQGJpdGJhdHRsZS5pdCIsInBhc3N3b3JkIjoiYml0YmF0dGxlIiwiaWF0IjoxNjg3ODYxMTI1fQ._dUKfo-8Yeszpxure7l0zvXSMfwf_wtz-AxRcXxPVwQ"
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"email":"lorisbitbattle.it",
	"password":"bitbattlePA23!"
}
~~~
genererà:
~~~
{
	"BAD_REQUEST": "Il formato dell'email inserita non è corretto"
}
~~~

### POST: /register

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"email": "emanuele@bitbattle.it",
	"password": "vraiisbetteR!5"
}
~~~

Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /register
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkEmail()
middleware ->>- app : next()
app ->>+ middleware: checkPassword()
middleware ->>- app : next()
app ->>+ controller: createUser()
controller->>+ service: createUserService()
service ->>+ model: createUserDb()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{
	"OK": "Utente creato con successo"
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"email": "emanuele@bitbattle.it",
	"password": "vraiisbette"
}
~~~
genererà:
~~~
{
	"BAD_REQUEST": "La password deve contenere almeno 8 caratteri ed un numero, un carattere speciale, un carattere maiuscolo e uno minuscolo"
}
~~~

### GET: /user/tokens

Per poter ottenere una risposta, non è necessario inserire un body.
Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /user/tokens
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ controller: getUserTokens()
controller->>+ service: getTokensService()
service ->>+ model: findUser.tokens()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il numero di token associati all'utente:
~~~
{
	"OK": {
		"tokens": 10
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"UNAUTHORIZED": "Questo utente non ha le autorizzazioni necessarie a svolgere l'operazione"
}
~~~

### POST: /user/classification

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"type": "ascendente"
}
~~~

Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /user/classification
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkClafficationType()
middleware ->>- app : next()
app ->>+ controller: getClassification()
controller->>+ service: getClassificationService()
service ->>+ model: getUsers()
model ->>+ model: orderUsers()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{

"OK": {
	"utente": [
		{
			"email": "lorenzo@bitbattle.it",
			"points": 26
		},
		{
			"email": "loris@bitbattle.it",
			"points": 13
		},
		{
			"email": "adriano@bitbattle.it",
			"points": 0
		},
	]
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"type": "pippo"
}
~~~
genererà:
~~~
{
	"BAD_REQUEST": "Type deve essere ascendente o discendente"
}
~~~


### POST: /user/stats e GET: /user/stats/download

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"startDate":"2023-06-13",
	"endDate":"2023-06-28"
}
~~~
In questo modo sarà possibile filtrare per data le statistiche.

Il meccanismo che si innesca all'atto delle due chiamate è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /user/stats
Client ->> app: /user/stats/download
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ controller: getStats()
app ->>+ controller: getGamePdf()
controller->>+ service: getUserStatsService()
controller->>+ service: getUserStatsService()
service ->>+ model: generateStats()
service ->>+ model: generatePdf()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente verranno restituite le statistiche associate all'utente:
~~~
{
	"OK": {
		"utente": {
		"email": "loris@bitbattle.it",
		"played": 2,
		"win": 1,
		"lose": 1,
		"totalMoves": 3,
		"maxMovesPerGame": 2,
		"minMovesPerGame": 1,
		"standardDeviation": 0.7071067811865476,
		"mean": 1.5
		}
	}
}
~~~

In entrambi i casi verranno generate le statistiche associate all'utente, ma nel secondo caso non è possibile applicare alcun filtro e verrà generato un pdf contenente i dati generati nel path di progetto, nella cartella pdf.

In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"startDate":"2023-06-29",
	"endDate":"2023-06-28"
}
~~~
genererà:
~~~
{
	"BAD_REQUEST": "La data di fine deve precedere quella di inizio"
}
~~~

### PUT: /admin

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"email": "loris@bitbattle.it",
	"tokens":33
}
~~~

Il meccanismo che si innesca all'atto delle due chiamate è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /admin
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkIsAdmin()
middleware ->>- app : next()
app ->>+ middleware: checkEmail()
middleware ->>- app : next()
app ->>+ middleware: checkTokensBody()
middleware ->>- app : next()
app ->>+ controller: updateTokens()
controller->>+ service: updateUserTokensService()
service ->>+ model: updateUserTokensDb()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
~~~
{
	"OK": {
		"tokens": 30
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"UNAUTHORIZED": "Questo utente non ha le autorizzazioni necessarie a svolgere l'operazione"
}
~~~

### POST: /game/create"

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"name": "MyNewGame",
	"player1": "loris@bitbattle.it",
	"player2": "adriano@bitbattle.it",
	"grid_size": 7,
	"ships": [{"size1": 1}, {"size2": 1}, {"size3": 1}]
}
~~~

Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /game/create
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ middleware: checkShipFormat()
middleware ->>- app : next()
app ->>+ middleware: checkGridSize()
middleware ->>- app : next()
app ->>+ controller: createGame()
controller->>+ service: createGameService()
service ->>+ model: createGameDb()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{
	{
		"OK": {
			"game": {
			"game_id": 3,
			"name": "MyNewGame",
			"mod": "1v2",
			"grid_size": 7,
			"ships": [
				{
				"size1": 1
				},
				{
				"size2": 1
				},
				{
				"size3": 1
				}
			],
			"possible_moves": [
				{
				"move": [
				1,
				1
				],
				"ship": 0,
				"owner": ""
				},
				{
				"move": [
				1,
				2
				],
				"ship": 0,
				"owner": ""
				}
				{
				"move": [
				1,
				3
				],
				"ship": 3,
				"owner": "adriano@bitbattle.it"
				}
				...
			],
			"moves": [],
			"status": "started",
			"player0": "lorenzo@bitbattle.it",
			"player1": "loris@bitbattle.it",
			"player2": "adriano@bitbattle.it",
			"score": [],
			"created_at": "1687904828312",
			"winner": null
		}
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"BAD_REQUEST": "Esiste già un game con questo nome"
}
~~~

### GET: /game/:gameid

Per poter ottenere una risposta, non è necessario inserire un body.
Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /game/:gameid
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ middleware: checkGamePlayer()
middleware ->>- app : next()
app ->>+ controller: getGameInfo()
controller->>+ service: getGameInfoService()
service ->>+ model: getGameInfos()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{
	"OK": {
		"name": "game_1",
		"grid_size": 7,
		"player0": "lorenzo@bitbattle.it",
		"player1": "adriano@bitbattle.it",
		"mod": "1v2",
		"statusGame": "started",
		"turn": "lorenzo@bitbattle.it",
		"winnerGame": null,
		"score": []
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"UNAUTHORIZED": "Questo utente non ha le autorizzazioni necessarie a svolgere l'operazione"
}
~~~

### POST: /game/:gameid/move

Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:

~~~
{
	"move":[2, 3]
}
~~~

Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /game/:gameid/move
app ->>+ middleware: jsonParser()
middleware ->>- app : next()
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ middleware: checkGamePlayer()
middleware ->>- app : next()
app ->>+ middleware: checkMove()
middleware ->>- app : next()
app ->>+ controller: insertMove()
controller->>+ service: doMoveServiceGlobal()
service ->>+ model: doMoveAIService()
service ->>+ model: doMoveSingleService()
service ->>+ model: doMoveMultiplayerService()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{
	"OK": "Colpito!"
}
~~~

In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"type": "pippo"
}
~~~
genererà:
~~~
{
	"BAD_REQUEST": "Non puoi eseguire questa mossa, non è il tuo turno"
}
~~~

### GET: /game/:gameid/moves e GET: /game/:gameid/moves/download

Per poter ottenere una risposta, non è necessario inserire un body.
Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:

```mermaid
sequenceDiagram
autonumber

Client ->> app: /game/:gameid/moves
Client ->> app: /game/:gameid/moves/download
app ->>+ middleware: checkJwt()
middleware ->>- app : next()
app ->>+ middleware: checkGamePlayer()
middleware ->>- app : next()
app ->>+ controller: getMoves()
app ->>+ controller: downloadMoves()
controller->>+ service: getMovesService()
controller->>+ service: downloadMovesService()
service ->>+ model: gameMoves()
service ->>+ model: gameMovesDownload()
model ->>+ service : status: res.status()
model ->>- service : result: res.json()
service ->>+ controller: status: res.status()
service ->>- controller: result: res.json()
controller->>+ Client : status: res.status()
controller->>- Client : result: res.json()
```
Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:
~~~
{
	"OK": {
		"moves": [
			{
			"move": [
					1,
					1
				],
			"hit": false,
			"player": "loris@bitbattle.it"
			},
			{
			"move": [
					1,
					2
				],
			"hit": true,
			"player": "lorenzo@bitbattle.it"
			},
			{
			"move": [
					2,
					1
				],
			"hit": false,
			"player": "loris@bitbattle.it"
			}
		]
	}
}
~~~
In caso di errore invece verrà restituito un messaggio con chiave il nome del codice violato e un messaggio di errore a seconda della casistica, inoltre verrà settato lo stato a seconda dello status code:
~~~
{
	"UNAUTHORIZED": "Questo utente non ha le autorizzazioni necessarie a svolgere l'operazione"
}
~~~

La rotta download, oltre a restituire le mosse effettuate dall'utente in formato pdf nella cartella pdf nella cartella di progetto.


<p align="center">
<a href="#funzionamento">
<img  width="30" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Testing

  

  
<p align="center">
<a href="#testing">
<img  width="30" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Autori
- [*Longarini Lorenzo*](https://github.com/LorenzoLongarini)
- [*Ramovini Loris*](https://github.com/lorisramovini)

<p align="center">
<a href="#indice">
<img  width="30" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>