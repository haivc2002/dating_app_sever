
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const Functions = require('../functions/query_all_get')

const functions = new Functions();

const ListNominationController = {
  listNomination: async (req, res) => {
    const { idUser, limit, gender, radius, page } = req.query;
    const searchRadius = radius ? parseFloat(radius) : 1;
    const itemsPerPage = limit ? parseInt(limit, 10) : 10;
    const pageNumber = page ? parseInt(page, 10) : 0;

    if (!idUser) {
        return res.status(400).json({ error: 'idUser parameter is required' });
    }

    if (!gender) {
        return res.status(400).json({ error: 'gender parameter is required' });
    }

    try {
        const userLocation = await functions.dbGet('SELECT lat, lon FROM info WHERE idUser = ?', [idUser]);
        if (!userLocation) {
            return res.status(200).json({ result: 'Error', message: 'User not found' });
        }

        const { lat: userLat, lon: userLon } = userLocation;
        const users = await functions.dbAll(`
            SELECT user.idUser, info.lat, info.lon FROM user
            JOIN info ON user.idUser = info.idUser
            WHERE user.idUser != ? AND info.gender = ?
            AND user.idUser NOT IN (SELECT keyMatch FROM match WHERE idUser = ?)
        `, [idUser, gender, idUser]);

        const filteredUsers = users.filter(user => {
            const distance = functions.calculateDistance(userLat, userLon, user.lat, user.lon);
            return distance <= searchRadius;
        });

        const startIndex = pageNumber * itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

        const promises = paginatedUsers.map(async user => {
            const images = await functions.dbAll('SELECT * FROM listImage WHERE idUser = ?', [user.idUser]);
            const info = await functions.dbGet('SELECT * FROM info WHERE idUser = ?', [user.idUser]);
            const infoMore = await functions.dbGet('SELECT * FROM infoMore WHERE idUser = ?', [user.idUser]);

            return {
                idUser: user.idUser,
                listImage: images,
                info: info,
                infoMore: infoMore || {}
            };
        });

        const results = await Promise.all(promises);

        res.json({
            result: 'Success',
            message: 'OK',
            nominations: results,
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
}

}

module.exports = ListNominationController;