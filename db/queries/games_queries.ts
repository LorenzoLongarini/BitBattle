import { game } from '../../model/game';

export async function findAllGames(): Promise<any> {

    return await game.findAll();

}

export async function findWinner(player0: string): Promise<any> {

    return await game.findAll({
        where: {
            winner: player0,
        }
    });

}
export async function findAllPlayed0(player0: string): Promise<any> {

    return await game.findAll({
        where: {
            player0: player0,
        }
    });

}

export async function findAllPlayed1(player1: string): Promise<any> {

    return await game.findAll({
        where: {
            player1: player1,
        }
    });

}

export async function findAllPlayed2(player2: string): Promise<any> {

    return await game.findAll({
        where: {
            player2: player2,
        }
    });

}
export async function findPlayer0(name: string, player0: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player0: player0,
        }
    });

}

export async function findPlayer1(name: string, player1: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player1: player1,
        }
    });

}
export async function findPlayer2(name: string, player2: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
            player1: player2,
        }
    });

}

export async function findGame(name: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
        }
    });

}

export async function findGameById(game_id: any): Promise<any> {

    return await game.findAll({
        where: {
            game_id: game_id,
        }
    });

}

export async function gameOver(name: string): Promise<any> {
    return await game.update({ status: "finished" }, {
        where: {
            name: name,
        }
    });
}


export async function addMoveDb(name: string, moves: any): Promise<any> {

    return await game.update({ moves: moves }, {
        where: {
            name: name
        }
    });
}

export async function updateWinner(name: string, email: string): Promise<any> {
    return await game.update({ winner: email }, {
        where: {
            name: name
        }
    });
}

export async function updateScore(name: string, score: any): Promise<any> {
    return await game.update({ score: score }, {
        where: {
            name: name
        }
    });
}

