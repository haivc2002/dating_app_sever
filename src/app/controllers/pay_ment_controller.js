const moment = require('moment');
const Functions = require('../functions/query_all_get');
const functions = new Functions();

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const PaymentController = {
    getUrl: (req, res, next) => {
        const idUser = req.body.idUser;
        if (!idUser) {
            return res.status(400).json({ error: "idUser is required" });
        }

        process.env.TZ = 'Asia/Ho_Chi_Minh';
        
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let config = require('../../config/default.json');
        
        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let orderId = moment(date).format('DDHHmmss');
        let amount = 100000;
        let bankCode = req.body.bankCode;

        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'en';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = `${config.vnp_ReturnUrl}?idUser=${idUser}`;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if(bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
    
        vnp_Params = sortObject(vnp_Params);
    
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        const paymentData = {
            source: vnpUrl,
            amount: amount
        };

        res.json(paymentData);
    },

    vnpReturn: async (req, res, next) => {
        const idUser = req.query.idUser; 
        console.log('idUser:', idUser);
    
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
    
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        delete vnp_Params['idUser']; 
    
        vnp_Params = sortObject(vnp_Params);
        console.log('vnp_Params:', vnp_Params);
    
        let config = require('../../config/default.json');
        let secretKey = config.vnp_HashSecret;
    
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
        if (secureHash === signed) {
            try {
                const now = moment();
                const deadline = now.add(1, 'month').format('DD/MM/YYYY HH:mm:ss');
                await functions.dbRun("UPDATE info SET deadline = ? WHERE idUser = ?", [deadline, idUser]);
    
                console.log("Deadline updated successfully");
                return res.render('payment_success');
            } catch (err) {
                console.error("Error updating deadline:", err);
                return res.status(500).render('payment_error');
            }
        } else {
            return res.render('payment_error');
        }
    },

    checkPayment: async (req, res) => {
        const idUser = req.query.idUser;
        
        try {
            const result = await functions.dbGet(
                `SELECT deadline FROM info WHERE idUser = ?`,
                [idUser]
            );
    
            if (result && result.deadline) {
                const [datePart, timePart] = result.deadline.split(' ');
                const [day, month, year] = datePart.split('/');
                const deadlineDate = new Date(`${year}-${month}-${day}T${timePart}`);
                const currentDate = new Date();
                if (deadlineDate > currentDate) {
                    res.json({ "result": result.deadline });
                } else {
                    res.json({ "result": "Error" });
                }
            } else {
                res.json({ "result": "Error" });
            }
        } catch (error) {
            console.error('Error fetching deadline:', error);
            res.status(500).json({ "result": "Error", "message": "Internal Server Error" });
        }
    }
}

module.exports = PaymentController;