class ResponseInfo {
    constructor({ result, message = null}) {
      this.result = result;
      this.message = message;
    }
  }
  
  module.exports = ResponseInfo;
    