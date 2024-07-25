const ResponseInfo = require('../models/auth/response_register');

class RegisterFunction {
    containsVietnameseCharacters = (str) => {
        const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/;
        return vietnameseRegex.test(str);
    };

    checkNull(message, ...args) {
        for (const arg of args) {
          if (!arg || arg.trim() === '') {
            return new ResponseInfo({
              result: 'Error',
              message: message
            });
          }
        }
        return null;
    }
}

module.exports = RegisterFunction;