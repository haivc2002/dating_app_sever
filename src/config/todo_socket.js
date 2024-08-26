const WebSocket = require('ws');
const Functions = require('../app/functions/query_all_get');
const axios = require('axios');
const Common = require('../app/common');

const functions = new Functions();

class TodoSocket {
    async notificationLocal(idUser, ws) {
        if (idUser) {
            const matchResult = await functions.dbGet(
                `SELECT COUNT(*) as matchCount FROM match m1
                 JOIN match m2 ON m1.idUser = m2.keyMatch AND m1.keyMatch = m2.idUser
                 WHERE m1.idUser = ? AND m1.newState = true`,
                [idUser]
            );

            const messageResult = await functions.dbGet(
                `SELECT COUNT(*) as newMessages FROM message
                 WHERE receiver = ? AND newState = true`,
                [idUser]
            );

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    result: 'Success',
                    matchCount: matchResult?.matchCount || 0,
                    newMessages: messageResult?.newMessages || 0
                }));
            }
        } else {
            ws.send(JSON.stringify({ error: 'idUser parameter is required' }));
        }
    }

    // async getMessageObject(idUser, receiver, ws) {
    //     if (idUser && receiver) {
    //         const messages = await functions.dbAll(`
    //             SELECT id, idUser, receiver, content, newState 
    //             FROM message 
    //             WHERE (idUser = ? AND receiver = ?) OR (idUser = ? AND receiver = ?)
    //             ORDER BY id DESC
    //         `, [idUser, receiver, receiver, idUser]);
    //         const formattedMessages = messages.map(message => ({
    //             ...message,
    //             idUser: Number(message.idUser),
    //             receiver: Number(message.receiver)
    //         }));

    //         if (ws.readyState === WebSocket.OPEN) {
    //             ws.send(JSON.stringify({
    //                 result: 'Success',
    //                 messages: formattedMessages
    //             }));
    //         }
    //     } else {
    //         ws.send(JSON.stringify({ error: 'Missing required fields: idUser, receiver' }));
    //     }
    // }

    async getMessageObject(idUser, receiver, id, ws) {
        if (idUser && receiver) {
            const messages = await functions.dbAll(`
                SELECT id, idUser, receiver, content, newState 
                FROM message 
                WHERE (idUser = ? AND receiver = ?) OR (idUser = ? AND receiver = ?)
                ORDER BY id DESC
            `, [idUser, receiver, receiver, idUser]);
            const formattedMessages = messages.map(message => ({
                ...message,
                idUser: Number(message.idUser),
                receiver: Number(message.receiver)
            }));

            try {
                const response =  await axios.put(`${Common.ipConfig}message/isCheckNewMessage`, {
                    idUser: idUser,
                    id: id,
                });
                console.log('PUT request success:', response.data);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        result: 'Success',
                        messages: formattedMessages
                    }));
                }
            } catch (error) {
                console.error('PUT request failed:', error);
            }
        } else {
            ws.send(JSON.stringify({ error: 'Missing required fields: idUser, receiver' }));
        }
    }
}

module.exports = TodoSocket;