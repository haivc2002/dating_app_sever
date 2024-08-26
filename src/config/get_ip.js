const os = require('os');
const Functions = require('../app/functions/query_all_get');

const functions = new Functions();

function getWifiIPAddress() {
    const interfaces = os.networkInterfaces();
    let wifiIP = null;

    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];

        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal && alias.address.startsWith('192.168.')) {
                wifiIP = alias.address;
            }
        }
    }

    return wifiIP;
}

class ip {
    static async setIp() {
        const wifiIP = getWifiIPAddress();
        if (!wifiIP) {
            console.log('Không tìm thấy địa chỉ IP Wi-Fi');
            return;
        }

        console.log(`Wi-Fi IP Address: ${wifiIP}`);

        const images = await functions.dbAll(`SELECT id, image FROM listImage`, []);
        for (const imageRecord of images) {
            try {
                const imageUrl = new URL(imageRecord.image);

                if (imageUrl.hostname.startsWith('192.168.') && imageUrl.hostname !== wifiIP) {
                    const newImageUrl = imageRecord.image.replace(imageUrl.hostname, wifiIP);

                    await functions.dbRun(`UPDATE listImage SET image = ? WHERE id = ?`, [newImageUrl, imageRecord.id]);

                    console.log(`update ${imageRecord.id}: ${newImageUrl}`);
                } else {
                    console.log(`${imageRecord.image}`);
                }
            } catch (error) {
                console.log(`URL không hợp lệ hoặc không thể xử lý: ${imageRecord.image}`);
            }
        }
    }
}

module.exports = ip;
