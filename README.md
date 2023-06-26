
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
<a  href="#Indice">Indice</a>
</p>

</p>
<p  align="center">
<a  href="#Obiettivi del progetto">Obiettivi del progetto</a>&nbsp•
<a  href="#Progettazione">Progettazione</a>&nbsp•
<a  href="#Funzionamento">Funzionamento</a>&nbsp•
<a  href="#Testing">Testing</a>&nbsp•
<a  href="#Autori">Autori</a>
</p>
<br>
<br>
</div>

  

  

## Obiettivi del progetto

  
  
**Descrizione del progetto:**
*Le specifiche del progetto sono state fornite direttamente dal docente [*Adriano Mancini*](https://github.com/manciniadriano):
Si realizzi un sistema che consenta di gestire il gioco della battaglia navale. In particolare, il sistema deve prevedere la possibilità di far interagire due o tre utenti (autenticati mediante JWT) o un utente contro l’elaboratore. Ci possono essere più partite attive in un dato momento. Un utente può allo stesso tempo partecipare ad una ed una sola partita. Si chiede di sviluppare anche la possibilità di giocare contro l’elaboratore (di seguito IA). Nel caso di IA la logica può essere semplice (mosse randomiche all’interno della griglia) o tenere in considerazione lo storico delle mosse (es. cercare nei vicini); l’implementazione è carico del gruppo. Nel caso di gioco a tre player la turnazione deve essere A->B, C->A, B->C , C->B, A->C, B->A (il gioco potrebbe non essere equo)*

<p align="center">
<img  width="250" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/moves.gif">
</p>

*Dare la possibilità di creare una nuova partita specificando (codifica a scelta dello studente):*
- *Tipologia: utente contro utente o utente contro IA o utente contro 2 utenti*
- *Dimensione della griglia *
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
<a href="#Indice">
<img  width="60" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Progettazione

### Diagrammi UML

### Pattern utilizzati

#### MVCS
  
#### Middleware

#### Middleware

#### Middleware

<p align="center">
<a href="#Indice">
<img  width="60" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Funzionamento

```mermaid

  

sequenceDiagram

  

autonumber

  

Client ->> app: /admin

  

app ->>+ middleware: jsonParser()

  

middleware ->>- app : next()

  

app ->>+ middleware: checkIsAdmin()

  

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

<p align="center">
<a href="#Indice">
<img  width="60" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Testing

  

  
<p align="center">
<a href="#Indice">
<img  width="60" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>

## Autori
- [*Longarini Lorenzo*](https://github.com/LorenzoLongarini)
- [*Ramovini Loris*](https://github.com/lorisramovini)

<p align="center">
<a href="#Indice">
<img  width="60" src="https://github.com/LorenzoLongarini/BitBattle/blob/dev_lorenzo/assets/imgs/home.png">
</a>
</p>