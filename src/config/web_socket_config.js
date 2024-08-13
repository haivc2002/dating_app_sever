const WebSocket = require('ws');
const Functions = require('../app/functions/query_all_get');

const functions = new Functions();

function startWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, request) => {
        // console.log('Client connected');

        ws.on('message', async (message) => {
            try {
                const { idUser } = JSON.parse(message);

                if (idUser) {
                    const result = await functions.dbGet(
                        `SELECT COUNT(*) as matchCount FROM match m1
                         JOIN match m2 ON m1.idUser = m2.keyMatch AND m1.keyMatch = m2.idUser
                         WHERE m1.idUser = ? AND m1.newState = true`,
                        [idUser]
                    );

                    if (result && result.matchCount !== undefined) {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ result: 'Success', matchCount: result.matchCount }));
                        }
                    } else {
                        ws.send(JSON.stringify({ error: 'No match data found' }));
                    }
                } else {
                    ws.send(JSON.stringify({ error: 'idUser parameter is required' }));
                }
            } catch (err) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ error: 'Database error', details: err.message }));
                }
            }
        });

        ws.on('close', () => {
            // console.log('Client disconnected');
        });

        ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));
    });

    return wss;
}

module.exports = startWebSocketServer;

