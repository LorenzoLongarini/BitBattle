import { user } from '../../model/user';
import { game } from '../../model/game';
import { Request } from "express";

const time: number = Date.now();

/**
 * Trova un utente nel database in base all'indirizzo email specificato.
 * Restituisce una promessa che contiene i dettagli dell'utente trovato.
 *
 * @param email - L'indirizzo email dell'utente da cercare nel database.
 * @returns Una promessa che contiene i dettagli dell'utente trovato.
 */
export async function findUser(email: any): Promise<any> {

    return await user.findAll({
        where: {
            email: email,
        }
    });

}

/**
 * Trova tutti gli utenti nel database.
 * Restituisce una promessa che contiene tutti gli utenti trovati nel database.
 *
 * @returns Una promessa che contiene tutti gli utenti trovati nel database.
 */
export async function findAllUsers(): Promise<any> {

    return await user.findAll();

}

/**
 * Crea un nuovo utente nel database con i dettagli forniti nella richiesta.
 * Restituisce una promessa che indica se l'utente è stato creato con successo.
 *
 * @param req - La richiesta contenente i dettagli dell'utente da creare.
 * @returns Una promessa che indica se l'utente è stato creato con successo.
 */
export async function createUserDb(req: any): Promise<any> {

    return await user.create({
        email: req.body.email,
        password: req.body.password,
        tokens: 10,
        isadmin: false,
        isplaying: false,
        points: 0,
    });

}

/**
 * Imposta lo stato "isPlaying" dell'utente nel database come "true".
 * Restituisce una promessa che indica se l'operazione è stata eseguita con successo.
 *
 * @param email - L'indirizzo email dell'utente per cui impostare lo stato "isPlaying".
 * @returns Una promessa che indica se l'operazione è stata eseguita con successo.
 */
export async function setIsPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: true }, {
        where: {
            email: email
        }
    });
}

/**
 * Imposta lo stato "isPlaying" dell'utente nel database come "false".
 * Restituisce una promessa che indica se l'operazione è stata eseguita con successo.
 *
 * @param email - L'indirizzo email dell'utente per cui impostare lo stato "isPlaying".
 * @returns Una promessa che indica se l'operazione è stata eseguita con successo.
 */
export async function setIsNotPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: false }, {
        where: {
            email: email
        }
    });
}

/**
 * Crea una nuova partita nel database con i dettagli forniti nella richiesta.
 * Restituisce una promessa che indica se la partita è stata creata con successo.
 *
 * @param req - La richiesta contenente i dettagli della partita da creare.
 * @param possibleMoves - Array contenente le mosse possibili per la partita.
 * @param mod - Il tipo di modalità di gioco della partita.
 * @param player - Il giocatore che ha creato la partita.
 * @param player1 - Il giocatore 1 nella partita.
 * @param player2 - Il giocatore 2 nella partita.
 * @returns Una promessa che indica se la partita è stata creata con successo.
 */
export async function createGameDb(req: Request, possibleMoves: any[], mod: string, player: string, player1: string, player2: string): Promise<any> {

    return await game.create({
        name: req.body.name,
        mod: mod,
        grid_size: req.body.grid_size,
        ships: req.body.ships,
        possible_moves: possibleMoves,
        moves: [],
        status: "started",
        result: [],
        player0: player,
        player1: player1,
        player2: player2,
        score: [],
        created_at: time
    });
}

/**
 * Aggiorna lo stato "isplaying" dell'utente nel database.
 * Restituisce una promessa che indica se l'operazione è stata eseguita con successo.
 *
 * @param status - Il nuovo stato "isplaying" da impostare per l'utente.
 * @param email - L'indirizzo email dell'utente da aggiornare.
 * @returns Una promessa che indica se l'operazione è stata eseguita con successo.
 */
export async function updateUserStatus(status: boolean, email: string): Promise<any> {
    return await user.update({ isplaying: status }, {
        where: {
            email: email
        }
    });
}

/**
 * Aggiorna i punti dell'utente nel database.
 * Restituisce una promessa che indica se l'operazione è stata eseguita con successo.
 *
 * @param points - I nuovi punti da impostare per l'utente.
 * @param email - L'indirizzo email dell'utente da aggiornare.
 * @returns Una promessa che indica se l'operazione è stata eseguita con successo.
 */
export async function updateUserPoints(points: number, email: string): Promise<any> {
    return await user.update({ points: points }, {
        where: {
            email: email
        }
    });
}
