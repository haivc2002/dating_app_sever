class ResponseInfo {
    constructor({ result, message = null, idInfoMore = null, idCompatible = null }) {
      this.result = result;
      this.message = message;
      this.idInfoMore = idInfoMore;
      this.idCompatible = idCompatible;
    }
  }
  
  module.exports = ResponseInfo;
    