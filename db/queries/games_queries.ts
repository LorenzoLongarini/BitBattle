import { game } from '../../model/game';

/**
 * Recupera tutti i games dal database.
 *
 * @returns Restituisce una promessa che contiene tutti i games presenti nel database.
 */
export async function findAllGames(): Promise<any> {

    return await game.findAll();

}

/**
 * Trova tutti i games in cui il giocatore specificato è il vincitore.
 *
 * @param player0 - Il nome del giocatore vincitore da cercare.
 * @returns Una promessa che restituisce tutti i games in cui il giocatore specificato è il vincitore.
 */
export async function findWinner(player0: string): Promise<any> {

    return await game.findAll({
        where: {
            winner: player0,
        }
    });

}

/**
 * Trova tutti i games in cui il giocatore specificato è il player0.
 *
 * @param player0 - Il nome del giocatore player0 da cercare.
 * @returns Una promessa che restituisce tutti i games in cui il giocatore specificato è il player0.
 */
export async function findAllPlayed0(player0: string): Promise<any> {

    return await game.findAll({
        where: {
            player0: player0,
        }
    });

}

/**
 * Trova tutti i games in cui il giocatore specificato è il player1.
 *
 * @param player1 - Il nome del giocatore player0 da cercare.
 * @returns Una promessa che restituisce tutti i games in cui il giocatore specificato è il player1.
 */
export async function findAllPlayed1(player1: string): Promise<any> {

    return await game.findAll({
        where: {
            player1: player1,
        }
    });

}

/**
 * Trova tutti i games in cui il giocatore specificato è il player2.
 *
 * @param player2 - Il nome del giocatore player0 da cercare.
 * @returns Una promessa che restituisce tutti i games in cui il giocatore specificato è il player2.
 */
export async function findAllPlayed2(player2: string): Promise<any> {

    return await game.findAll({
        where: {
            player2: player2,
        }
    });

}

/**
 * Trova tutti i games con il nome specificato in cui il giocatore specificato è il player0.
 *
 * @param name - Il nome del game da cercare.
 * @param player0 - Il nome del giocatore player0 da cercare.
 * @returns Una promessa che restituisce tutti i games con il nome specificato in cui il giocatore specificato è il player0.
 */
export async function findPlayer0(name: string, player0: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player0: player0,
        }
    });

}

/**
 * Trova tutti i games con il nome specificato in cui il giocatore specificato è il player1.
 *
 * @param name - Il nome del game da cercare.
 * @param player0 - Il nome del giocatore player1 da cercare.
 * @returns Una promessa che restituisce tutti i games con il nome specificato in cui il giocatore specificato è il player1.
 */
export async function findPlayer1(name: string, player1: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player1: player1,
        }
    });

}

/**
 * Trova tutti i games con il nome specificato in cui il giocatore specificato è il player2.
 *
 * @param name - Il nome del game da cercare.
 * @param player2 - Il nome del giocatore player0 da cercare.
 * @returns Una promessa che restituisce tutti i games con il nome specificato in cui il giocatore specificato è il player2.
 */
export async function findPlayer2(name: string, player2: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player2: player2,
        }
    });

}

/**
 * Trova tutti i games con il nome specificato.
 *
 * @param name - Il nome del game da cercare.
 * @returns Una promessa che restituisce tutti i games con il nome specificato.
 */
export async function findGame(name: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
        }
    });

}

/**
 * Trova un game nel database utilizzando l'ID del gioco.
 *
 * @param game_id - L'ID del game da cercare.
 * @returns Una promessa che restituisce il game corrispondente all'ID specificato.
 */
export async function findGameById(game_id: any): Promise<any> {

    return await game.findAll({
        where: {
            game_id: game_id,
        }
    });

}

/**
 * Imposta lo stato di un game specificato con "finished" per indicare che il gioco è terminato.
 *
 * @param name - Il nome del game da impostare come terminato.
 * @returns Una promessa che indica se l'operazione di aggiornamento è stata eseguita con successo.
 */
export async function gameOver(name: string): Promise<any> {
    return await game.update({ status: "finished" }, {
        where: {
            name: name,
        }
    });
}

/**
 * Aggiunge le mosse al game specificato nel database.
 *
 * @param name - Il nome del game a cui aggiungere le mosse.
 * @param moves - Le mosse da aggiungere al game.
 * @returns Una promessa che indica se l'operazione di aggiornamento è stata eseguita con successo.
 */
export async function addMoveDb(name: string, moves: any): Promise<any> {

    return await game.update({ moves: moves }, {
        where: {
            name: name
        }
    });
}

/**
 * Aggiorna il vincitore del game specificato nel database.
 *
 * @param name - Il nome del game in cui aggiornare il vincitore.
 * @param email - L'indirizzo email del vincitore da aggiornare.
 * @returns Una promessa che indica se l'operazione di aggiornamento è stata eseguita con successo.
 */
export async function updateWinner(name: string, email: string): Promise<any> {
    return await game.update({ winner: email }, {
        where: {
            name: name
        }
    });
}

/**
 * Aggiorna il punteggio del game specificato nel database.
 *
 * @param name - Il nome del game in cui aggiornare il punteggio.
 * @param score - Il punteggio da aggiornare per il game.
 * @returns Una promessa che indica se l'operazione di aggiornamento è stata eseguita con successo.
 */
export async function updateScore(name: string, score: any): Promise<any> {
    return await game.update({ score: score }, {
        where: {
            name: name
        }
    });
}

