class ResponseRegister {
  constructor({ result, message = null, idUser = null }) {
    this.result = result;
    this.message = message;
    this.idUser = idUser;
  }
}

module.exports = ResponseRegister;
  