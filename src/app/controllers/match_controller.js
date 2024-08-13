const Query = require('../init/query');
const Functions = require('../functions/query_all_get')

Query.tableMatch();

const functions = new Functions();

const MatchController = {
    add: async (req, res) => {
        const { idUser, keyMatch } = req.body;
    
        if (!idUser || !keyMatch) {
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
            await functions.dbRun(insertMatch, [id, idUser, keyMatch]);
    
            const reciprocalMatch = await functions.dbGet(
                'SELECT * FROM match WHERE idUser = ? AND keyMatch = ?',
                [keyMatch, idUser]
            );
    
            let newState = false;
    
            if (reciprocalMatch) {
                await functions.dbRun(
                    'UPDATE match SET newState = 1 WHERE idUser = ? AND keyMatch = ?',
                    [idUser, keyMatch]
                );
                await functions.dbRun(
                    'UPDATE match SET newState = 1 WHERE idUser = ? AND keyMatch = ?',
                    [keyMatch, idUser]
                );
                newState = true;
            }
    
            const keyMatches = await functions.dbAll('SELECT keyMatch FROM match WHERE idUser = ?', [keyMatch]);
            const keyMatchList = keyMatches.map(match => match.keyMatch);
    
            res.status(200).json({
                result: 'Success',
                message: 'Match added successfully',
                keyMatches: keyMatchList,
                newState: newState
            });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    },

    listPairing: async (req, res) => {
        const { idUser } = req.query;

        if (!idUser) {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'idUser parameter is required'
            });
        }

        try {
            const matchedUsers = await functions.dbAll(
                `SELECT m1.keyMatch as matchedUserId, m1.newState FROM match m1
                 JOIN match m2 ON m1.idUser = m2.keyMatch AND m1.keyMatch = m2.idUser
                 WHERE m1.idUser = ?`,
                [idUser]
            );

            if (matchedUsers.length === 0) {
                return res.status(200).json({
                    result: 'Success',
                    message: 'No matches found',
                    matches: []
                });
            }

            const promises = matchedUsers.map(async (match) => {
                const userId = match.matchedUserId;
                const images = await functions.dbAll('SELECT * FROM listImage WHERE idUser = ?', [userId]);
                const info = await functions.dbGet('SELECT * FROM info WHERE idUser = ?', [userId]);
                const infoMore = await functions.dbGet('SELECT * FROM infoMore WHERE idUser = ?', [userId]);

                return {
                    idUser: userId,
                    listImage: images,
                    info: info,
                    infoMore: infoMore || {},
                    newState: match.newState 
                };
            });

            const results = await Promise.all(promises);

            res.json({
                result: 'Success',
                message: 'Matches retrieved successfully',
                matches: results
            });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    },

    listUnmatchedUsers: async (req, res) => {
        const { idUser } = req.query;
    
        if (!idUser) {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'idUser parameter is required'
            });
        }
    
        try {
            const unmatchedUsers = await functions.dbAll(
                `SELECT m1.idUser as unmatchedUserId FROM match m1
                 LEFT JOIN match m2 ON m1.idUser = m2.keyMatch AND m1.keyMatch = m2.idUser
                 WHERE m1.keyMatch = ? AND m2.idUser IS NULL`,
                [idUser]
            );
    
            if (unmatchedUsers.length === 0) {
                return res.status(200).json({
                    result: 'Success',
                    message: 'No unmatched users found',
                    unmatchedUsers: []
                });
            }
    
            const promises = unmatchedUsers.map(async (user) => {
                const userId = user.unmatchedUserId;
                const images = await functions.dbAll('SELECT * FROM listImage WHERE idUser = ?', [userId]);
                const info = await functions.dbGet('SELECT * FROM info WHERE idUser = ?', [userId]);
                const infoMore = await functions.dbGet('SELECT * FROM infoMore WHERE idUser = ?', [userId]);
    
                return {
                    idUser: userId,
                    listImage: images,
                    info: info,
                    infoMore: infoMore || {}
                };
            });
    
            const results = await Promise.all(promises);
    
            res.json({
                result: 'Success',
                message: 'Unmatched users retrieved successfully',
                unmatchedUsers: results
            });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    },

    checkNewState: async (req, res) => {
        const { id, newState } = req.body;

        if (!id || newState === undefined) {
            return res.status(400).json({ error: 'id and newState are required' });
        }

        try {
            const result = await functions.dbRun(
                `UPDATE match SET newState = ? WHERE id = ?`,
                [newState, id]
            );

            if (result) {
                return res.status(200).json({ result: 'Success', message: 'newState updated successfully' });
            } else {
                return res.status(400).json({ error: 'Update failed, no rows affected' });
            }
        } catch (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
    }


}

module.exports = MatchController;