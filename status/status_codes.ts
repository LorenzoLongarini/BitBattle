export enum CustomStatusCodes {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Messages200 {

}
export enum Messages300 {

}
export enum Messages400 {
    UnauthorizedUser = "Non è possibile creare l\'utente perchè è già esistente",
    GameAlreadyExists = "Esiste già un game con questo nome",
    OutOfBoundGrid = "La dimensione della griglia deve essere compreso tra 3 e 10",
    OutOfBoundShips = "Il numero di navi inserite è troppo alto",
    NoTokens = "Tokens insufficienti per creare il game, contattare l\'amministratore",
    NotExistingGame = "Il game non è presente nel database"
}

export enum Messages500 {
    UnfoundUser = "Non è possibile trovare l\'utente specificato",
    ImpossibileCreation = "Non è possibile creare il game"

}