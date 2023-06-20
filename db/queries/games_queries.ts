import { game } from '../../model/game';

export async function findAllGames(): Promise<any> {

    return await game.findAll();

}

export async function findGame(name: string): Promise<any> {

    return await game.findAll({
        where: {
            name: name,
        }
    });

}

export async function addMoveDb(name: string, moves: any): Promise<any> {

    return await game.update({ moves: moves}, {
        where: {
            name: name
        }
    });
}
