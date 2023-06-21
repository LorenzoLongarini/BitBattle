import { game } from '../../model/game';

export async function findAllGames(): Promise<any> {

    return await game.findAll();

}

export async function findGame(player: string): Promise<any> {

    return await game.findAll({
        where: {
            players: player,
        }
    });

}

export async function findPlayer(name: string): Promise<any> {

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
