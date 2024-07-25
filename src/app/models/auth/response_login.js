class ResponseLogin {
    constructor({ 
        result, 
        message = null, 
        idUser = null, 
        email = null,
        listImage = [],
        info = {},
        infoMore = {},
    }) {
        this.result = result;
        this.message = message;

        this.idUser = idUser;
        this.email = email;

        this.listImage = listImage;
        this.info = info;
        this.infoMore = infoMore;
    }
}

module.exports = ResponseLogin;