import { game } from '../../model/game';

export async function findAllGames(): Promise<any> {

    return await game.findAll();

}

export async function findPlayer0(player0: string): Promise<any> {

    return await game.findAll({
        where: {
            player0: player0,
        }
    });

}

export async function findPlayer1(player1: string): Promise<any> {

    return await game.findAll({
        where: {
            player1: player1,
        }
    });

}
export async function findPlayer2(player2: string): Promise<any> {

    return await game.findAll({
        where: {
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

export async function updateScore(name: string, score: number): Promise<any> {
    return await game.update({ score: score }, {
        where: {
            name: name
        }
    });
}

