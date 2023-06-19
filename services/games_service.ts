import { findAllGames } from '../db/queries/games_queries';

export async function getGamesService(req: any, res: any) {
    try {
        const game: any = await findAllGames();
        console.log(game[0].dataValues.ships[0].size1);
        res.json({ game: game });

    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
}