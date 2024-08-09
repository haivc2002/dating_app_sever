const ResponseInfo = require('../models/auth/response_register');

class RegisterFunction {
    containsVietnameseCharacters = (str) => {
        const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/;
        return vietnameseRegex.test(str);
    };

    checkNull(message, ...args) {
      for (const arg of args) {
          if (typeof arg === 'string' && arg.trim() === '') {
              return new ResponseInfo({
                  result: 'Error',
                  message: message
              });
          }
          if (arg === undefined || arg === null) {
              return new ResponseInfo({
                  result: 'Error',
                  message: message
              });
          }
      }
      return null;
    };

    getZodiacSign(day, month) {
        const zodiacSigns = [
          "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", 
          "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"
        ];
      
        const lastDay = [
          19, 18, 20, 20, 20, 21, 22, 22, 22, 22, 21, 21
        ];
      
        return day > lastDay[month - 1] ? zodiacSigns[month] : zodiacSigns[month - 1];
    }
        
  
}

module.exports = RegisterFunction;