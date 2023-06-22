import { game } from '../../model/game';

export async function findAllGames(): Promise<any> {

    return await game.findAll();

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
