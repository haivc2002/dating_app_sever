const WebSocket = require('ws');
const Functions = require('../app/functions/query_all_get');
const TodoSocket = require('./todo_socket');

const functions = new Functions();
const todo_socket = new TodoSocket();

function startWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                const { type, idUser, receiver, id } = data;

                if (type === 'match') {
                    todo_socket.notificationLocal(idUser, ws);
                } else if (type === 'getMessages') {
                    todo_socket.getMessageObject(idUser, receiver, id, ws);
                } else {
                    ws.send(JSON.stringify({ error: 'Invalid message type' }));
                }
            } catch (err) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ error: 'Database error', details: err.message }));
                }
            }
        });

        ws.on('close', () => {
        });

        ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));
    });

    return wss;
}

module.exports = startWebSocketServer;
