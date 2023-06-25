export enum CustomStatusCodes {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    OK = 200,
}

export enum Messages200 {
    UserWin = "Game Over, hai vinto",
    AiWin = "Game Over, AI ha vinto",
    Win = "Hai vinto!",
    Hit = "Colpito!",
    Flop = "Acqua!"

}
export enum Messages300 {

}
export enum Messages400 {
    UnauthorizedUser = "Non è possibile creare l\'utente perchè è già esistente",
    Unauthorized = "Questo utente non ha le autorizzazioni necessarie a svolgere l\'operazione",
    GameAlreadyExists = "Esiste già un game con questo nome",
    OutOfBoundGrid = "La dimensione della griglia deve essere compreso tra 3 e 10",
    OutOfBoundShips = "Il numero di navi inserite è troppo alto",
    NoTokens = "Tokens insufficienti per creare il game, contattare l\'amministratore",
    UserNotFound = "Non è possibile trovare l\'utente specificato",
    GameNotFound = "Non è possibile trovare il game specificato",
    MoveUnauthorized = "Non puoi eseguire questa mossa",
    MoveAlreadyDone = "Mossa già eseguita",
    NotYourTurn = "Non puoi eseguire questa mossa, non è il tuo turno",
    GameIsEnded = "La partita è già terminata",
    EmailCheck = "Il formato dell'email inserita non è corretto",
    PasswordCheck = "La password deve contenere almeno 8 caratteri ed un numero, un carattere speciale, un carattere maiuscolo e uno minuscolo",
    SameUser = "Non puoi inserire lo stesso utente più volte nello stesso game",
    UserNotAvailable = "Uno o più utenti stanno già giocando in un altro game",
    CreatorNotAvailable = "Non puoi creare un game, sei già impegnato in un altro game"

}

export enum Messages500 {
    ImpossibileCreation = "Non è possibile creare il game",
    InternalServerError = "Errore interno al server"

}