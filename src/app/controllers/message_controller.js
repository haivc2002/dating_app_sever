
const Query = require('../init/query');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const Functions = require('../functions/query_all_get');
const axios = require('axios'); 
const Common = require('../common');

Query.tableMessage();

const functions = new Functions();

const MessageController = {
    
    sendMessage: async (req, res) => {
        try {
            const { idUser, receiver, content } = req.body;
    
            if (!idUser || !receiver || !content) {
                return res.status(400).json({ message: 'Missing required fields: idUser, receiver, content' });
            }
            const updateOldMessages = `
                UPDATE message 
                SET newState = false 
                WHERE ((idUser = ? AND receiver = ?) OR (idUser = ? AND receiver = ?)) 
                AND newState = true
            `;
            await functions.dbRun(updateOldMessages, [idUser, receiver, receiver, idUser]);
    
            const maxId = await functions.dbGet('SELECT MAX(id) as maxId FROM message');
            const id = maxId.maxId !== null ? maxId.maxId + 1 : 0;
    
            const insertMessage = `
                INSERT INTO message (id, idUser, receiver, content, newState) 
                VALUES (?, ?, ?, ?, ?)
            `;
            await functions.dbRun(insertMessage, [id, idUser, receiver, content, true]);
    
            const senderNameQuery = 'SELECT name FROM info WHERE idUser = ?';
            const senderNameResult = await functions.dbGet(senderNameQuery, [idUser]);
    
            if (!senderNameResult || !senderNameResult.name) {
                return res.status(404).json({ message: 'Sender name not found' });
            }
    
            const receiverTokenQuery = 'SELECT token FROM user WHERE idUser = ?';
            const receiverTokenResult = await functions.dbGet(receiverTokenQuery, [receiver]);
    
            if (receiverTokenResult && receiverTokenResult.token) {
                const title = senderNameResult.name;
                const body = "Send you a message";
    
                const response = await axios.post(`${Common.ipConfig}notify/push`, { 
                    title, 
                    body, 
                    token: receiverTokenResult.token 
                });
                console.log('Notification response:', response.data);
            } else {
                console.log(`Token not found for user: ${receiver}`);
            }
            res.status(200).json({ result: 'Success', message: 'Message sent successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },    

    outsideViewMessage: async (req, res) => {
        try {
            const { idUser } = req.query;
    
            if (!idUser) {
                return res.status(400).json({ message: 'Missing required field: idUser' });
            }
            const conversations = await functions.dbAll(`
                SELECT m1.idUser AS sender, m1.receiver, m1.id, m1.content, m1.newState, i.name, i.birthday, i.desiredState, i.word, i.academicLevel, i.lat, i.lon, i.describeYourself, i.gender, i.premiumState, i.deadline
                FROM message m1
                JOIN info i ON i.idUser = CASE WHEN m1.idUser = ? THEN m1.receiver ELSE m1.idUser END
                WHERE m1.id = (
                    SELECT MAX(m2.id)
                    FROM message m2
                    WHERE (m2.idUser = m1.idUser AND m2.receiver = m1.receiver) OR (m2.idUser = m1.receiver AND m2.receiver = m1.idUser)
                )
                AND (m1.idUser = ? OR m1.receiver = ?)
                ORDER BY m1.id DESC
            `, [idUser, idUser, idUser]);
    
            if (conversations.length === 0) {
                return res.status(404).json({ message: 'No conversations found' });
            }
    
            const formattedConversations = await Promise.all(conversations.map(async (conversation) => {
                const userMoreInfo = await functions.dbGet(`
                    SELECT idUser, height, wine, smoking, zodiac, religion, hometown 
                    FROM infoMore 
                    WHERE idUser = ?
                `, [conversation.sender === idUser ? conversation.receiver : conversation.sender]);
    
                const userImages = await functions.dbAll(`
                    SELECT id, idUser, image 
                    FROM listImage 
                    WHERE idUser = ?
                `, [conversation.sender === idUser ? conversation.receiver : conversation.sender]);
    
                return {
                    idUser: Number(conversation.sender === idUser ? conversation.receiver : conversation.sender),
                    latestMessage: {
                        id: conversation.id,
                        idUser: Number(conversation.sender),
                        receiver: Number(conversation.receiver),
                        content: conversation.content,
                        newState: conversation.newState
                    },
                    info: {
                        idUser: Number(conversation.sender === idUser ? conversation.receiver : conversation.sender),
                        name: conversation.name,
                        birthday: conversation.birthday,
                        desiredState: conversation.desiredState,
                        word: conversation.word,
                        academicLevel: conversation.academicLevel,
                        lat: conversation.lat,
                        lon: conversation.lon,
                        describeYourself: conversation.describeYourself,
                        gender: conversation.gender,
                        premiumState: conversation.premiumState,
                        deadline: conversation.deadline
                    },
                    infoMore: userMoreInfo,
                    listImage: userImages.map(image => ({
                        ...image,
                        idUser: Number(image.idUser)
                    }))
                };
            }));
    
            res.status(200).json({
                result: 'Success',
                conversations: formattedConversations
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    isCheckNewMessage: async (req, res) => {
        try {
            const { idUser, id } = req.body;

            if (!idUser || !id) {
                return res.status(400).json({ message: 'Missing required fields: idUser, id' });
            }
    
            const message = await functions.dbGet(
                `SELECT idUser FROM message WHERE id = ?`, 
                [id]
            );
    
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
    
            if (parseInt(message.idUser) !== parseInt(idUser)) {
                await functions.dbRun(
                    `UPDATE message 
                     SET newState = false 
                     WHERE id = ?`,
                    [id]
                );
                return res.status(200).json({ result: 'Success', message: 'newState updated to false' });
            } else {
                return res.status(200).json({ result: 'Success', message: 'No change' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }     
    }
    
}

module.exports = MessageController;

