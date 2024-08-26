const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

function generateMockData() {
    let emailPrefix = 'user';
    let passwordPrefix = 'password';
    let idUser = 18;

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS user (
            idUser INTEGER PRIMARY KEY,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )`);

        let stmt = db.prepare(`INSERT INTO user (idUser, email, password) VALUES (?, ?, ?)`);

        for (let i = 3; i <= 33; i++) {
            let email = `${emailPrefix}${i}@example.com`;
            let password = `${passwordPrefix}${i}`;
            stmt.run(idUser, email, password);
            idUser++;
        }

        stmt.finalize();
    });

    db.close(() => {
        console.log('Mock data generated successfully');
    });
}

function generateInfoMockData() {
    const names = ['Mai', 'Lan', 'Cúc', 'Hồng', 'Hương', 'Ly', 'Nhung', 'Thảo', 'Trang', 'Thu'];
    const jobs = ['Teacher', 'Engineer', 'Doctor', 'Designer', 'Nurse', 'Accountant', 'Manager', 'Developer', 'Lawyer', ''];

    const baseLat = 21.0287333;
    const baseLon = 105.7950344;
    const maxDistance = 15; // km
    const earthRadius = 6371; // Earth's radius in km

    // Chuyển đổi khoảng cách từ km sang độ
    function randomOffset() {
        return (Math.random() - 0.5) * 2 * maxDistance / earthRadius;
    }

    function randomLatitude() {
        return baseLat + randomOffset() * (180 / Math.PI);
    }

    function randomLongitude() {
        const latitudeInRadians = baseLat * (Math.PI / 180);
        return baseLon + randomOffset() * (180 / Math.PI) / Math.cos(latitudeInRadians);
    }

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS info (
            idUser INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            birthday TEXT NOT NULL,
            word TEXT,
            academicLevel TEXT NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            gender TEXT NOT NULL,
            premiumState INTEGER NOT NULL
        )`);

        let stmt = db.prepare(`INSERT INTO info (idUser, name, birthday, word, academicLevel, lat, lon, gender, premiumState) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        for (let idUser = 19; idUser <= 48; idUser++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const year = Math.floor(Math.random() * (2006 - 1999 + 1)) + 1999;
            const month = Math.floor(Math.random() * 12) + 1;
            const day = Math.floor(Math.random() * 28) + 1;
            const birthday = `${day}/${month}/${year}`;
            const word = jobs[Math.floor(Math.random() * jobs.length)];
            const academicLevel = Math.random() > 0.5 ? 'University' : 'Empty';
            const lat = randomLatitude();
            const lon = randomLongitude();
            const gender = 'female';
            const premiumState = 0;

            stmt.run(idUser, name, birthday, word, academicLevel, lat, lon, gender, premiumState);
        }

        stmt.finalize();
    });

    db.close(() => {
        console.log('Info mock data generated successfully');
    });
}

function generateListImageMockData() {
    const baseUrl = 'http://192.168.1.152:3000/uploads/';
    
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS listImage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idUser INTEGER NOT NULL,
            image TEXT NOT NULL
        )`);

        let stmt = db.prepare(`INSERT INTO listImage (idUser, image) VALUES (?, ?)`);

        let imageIndex = 1;

        for (let idUser = 19; idUser <= 48; idUser++) {
            const imageUrl = `${baseUrl}${imageIndex}.jpg`;
            stmt.run(idUser, imageUrl);

            imageIndex++;
            if (imageIndex > 29) {
                imageIndex = 1; // Reset the image index after 29
            }
        }

        stmt.finalize();
    });

    db.close(() => {
        console.log('ListImage mock data generated successfully');
    });
}

function generateInfoMoreMockData() {
    const wineOptions = ['Sometime', 'Usually', 'Have', 'Never', 'Undisclosed'];
    const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const religions = ['Atheist', 'Buddhism', 'Catholic', 'Protestantism', 'Islamic', 'CaoDai', 'HoaHao'];
    const hometowns = ['Hà Nội', 'Bắc Ninh', 'Hải Phòng', 'Quảng Ninh', 'Thái Bình', 'Nam Định', 'Hải Dương', 'Hưng Yên', 'Phú Thọ', 'Lạng Sơn'];

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS infoMore (
            idUser INTEGER PRIMARY KEY,
            height INTEGER NOT NULL,
            wine TEXT NOT NULL,
            smoking TEXT NOT NULL,
            Zodiac TEXT NOT NULL,
            religion TEXT NOT NULL,
            hometown TEXT NOT NULL
        )`);

        let stmt = db.prepare(`INSERT INTO infoMore (idUser, height, wine, smoking, Zodiac, religion, hometown) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`);

        for (let idUser = 19; idUser <= 48; idUser++) {
            const height = Math.floor(Math.random() * (165 - 150 + 1)) + 150;
            const wine = wineOptions[Math.floor(Math.random() * wineOptions.length)];
            const smoking = 'Never';
            const zodiac = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
            const religion = religions[Math.floor(Math.random() * religions.length)];
            const hometown = hometowns[Math.floor(Math.random() * hometowns.length)];

            stmt.run(idUser, height, wine, smoking, zodiac, religion, hometown);
        }

        stmt.finalize();
    });

    db.close(() => {
        console.log('InfoMore mock data generated successfully');
    });
}

function generateMatchMockData() {
    const keyMatch = 9;
    const newState = 0;

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS match (
            idUser INTEGER NOT NULL,
            keyMatch INTEGER NOT NULL,
            newState INTEGER NOT NULL,
            PRIMARY KEY (idUser, keyMatch)
        )`);

        let stmt = db.prepare(`INSERT INTO match (idUser, keyMatch, newState) VALUES (?, ?, ?)`);

        for (let idUser = 20; idUser <= 30; idUser++) {
            stmt.run(idUser, keyMatch, newState);
        }

        stmt.finalize();
    });

    db.close(() => {
        console.log('Match mock data generated successfully');
    });
}

module.exports = {
    generateMockData, 
    generateInfoMockData, 
    generateListImageMockData, 
    generateInfoMoreMockData, 
    generateMatchMockData
};
