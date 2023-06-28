import { user } from '../../model/user';
import { game } from '../../model/game';
import { Request } from "express";

const time: number = Date.now();

/**
 * Trova un utente nel database in base all'indirizzo email specificato.
 *
 * @param email - L'indirizzo email dell'utente da cercare nel database.
 * @returns Restituisce i dettagli dell'utente trovato.
 */
export async function findUser(email: string): Promise<any> {

    return await user.findAll({
        where: {
            email: email,
        }
    });

};

/**
 * Trova tutti gli utenti nel database.
 *
 * @returns Restituisce tutti gli utenti trovati nel database.
 */
export async function findAllUsers(): Promise<any> {

    return await user.findAll();

};

/**
 * Crea un nuovo utente nel database con i dettagli forniti nella richiesta.
 *
 * @param req - La richiesta contenente i dettagli dell'utente da creare.
 * @returns Restituisce l'utente creato.
 */
export async function createUserDb(req: Request): Promise<any> {

    return await user.create({
        email: req.body.email,
        password: req.body.password,
        tokens: 10,
        isadmin: false,
        isplaying: false,
        points: 0,
    });

};

/**
 * Imposta lo stato "isPlaying" dell'utente nel database come "true".
 *
 * @param email - L'indirizzo email dell'utente per cui impostare lo stato "isPlaying".
 * @returns 
 */
export async function setIsPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: true }, {
        where: {
            email: email
        }
    });
};

/**
 * Imposta lo stato "isPlaying" dell'utente nel database come "false".
 *
 * @param email - L'indirizzo email dell'utente per cui impostare lo stato "isPlaying".
 * @returns 
 */
export async function setIsNotPlayingDb(email: string): Promise<any> {
    return await user.update({ isplaying: false }, {
        where: {
            email: email
        }
    });
};

/**
 * Crea una nuova partita nel database con i dettagli forniti nella richiesta.
 *
 * @param req - La richiesta contenente i dettagli della partita da creare.
 * @param possibleMoves - Array contenente le mosse possibili per la partita.
 * @param mod - Il tipo di modalità di gioco della partita.
 * @param player - Il giocatore che ha creato la partita.
 * @param player1 - Il giocatore 1 nella partita.
 * @param player2 - Il giocatore 2 nella partita.
 * @returns Restituisce la partita creata.
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
};

/**
 * Aggiorna i punti dell'utente nel database.
 *
 * @param points - I nuovi punti da impostare per l'utente.
 * @param email - L'indirizzo email dell'utente da aggiornare.
 * @returns 
 */
export async function updateUserPoints(points: number, email: string): Promise<any> {
    return await user.update({ points: points }, {
        where: {
            email: email
        }
    });
};
