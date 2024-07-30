const Query = require('../init/query');
const Functions = require('../functions/query_all_get')

Query.tableMatch();

const functions = new Functions();

const MatchController = {
    add: async (req, res) => {
        const { idUser, keyMatch } = req.body;

        if (!idUser || !keyMatch || idUser.trim() === '' || keyMatch.trim() === '') {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'idUser and keyMatch parameters are required'
            });
        }

        try {
            const existingMatch = await functions.dbGet(
                'SELECT * FROM match WHERE idUser = ? AND keyMatch = ?',
                [idUser, keyMatch]
            );

            if (existingMatch) {
                return res.status(400).json({
                    result: 'Error',
                    message: 'keyMatch cannot be duplicated in idUser'
                });
            }

            const maxIdRow = await functions.dbGet('SELECT MAX(id) as maxId FROM match');
            const id = maxIdRow.maxId !== null ? maxIdRow.maxId + 1 : 0;

            const insertMatch = `
                INSERT INTO match (id, idUser, keyMatch)
                VALUES (?, ?, ?)
            `;
            const result = await functions.dbRun(insertMatch, [id, idUser, keyMatch]);

            const keyMatches = await functions.dbAll('SELECT keyMatch FROM match WHERE idUser = ?', [keyMatch]);

            const keyMatchList = keyMatches.map(match => match.keyMatch);

            res.status(201).json({
                result: 'Success',
                message: 'Match added successfully',
                matchId: result,
                keyMatches: keyMatchList
            });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    }

}

module.exports = MatchController;