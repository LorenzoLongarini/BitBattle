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
    MoveOk = "Mossa eseguita",
}
export enum Messages300 {

}
export enum Messages400 {
    UnauthorizedUser = "Non è possibile creare l\'utente perchè è già esistente",
    GameAlreadyExists = "Esiste già un game con questo nome",
    OutOfBoundGrid = "La dimensione della griglia deve essere compreso tra 3 e 10",
    OutOfBoundShips = "Il numero di navi inserite è troppo alto",
    NoTokens = "Tokens insufficienti per creare il game, contattare l\'amministratore",
    UserNotFound = "Non è possibile trovare l\'utente specificato",
    GameNotFound = "Non è possibile trovare il game specificato",
    MoveUnauthorized = "Non puoi eseguire questa mossa",
    MoveAlreadyDone = "Mossa già eseguita",
    GameIsEnded = "La partita è già terminata"
}

export enum Messages500 {
    ImpossibileCreation = "Non è possibile creare il game",
    InternalServerError = "Errore interno al server"

}