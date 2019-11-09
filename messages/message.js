class Message {

    constructor(user, type, content) {
        this.user = user;
        this.type = type;
        this.content = content;
    }

    toJson(){
        return {
            user : this.user,
            type : this.type,
            content: this.content
        }
    }

    toJsonString(){
        return JSON.stringify(this.toJson());
    }

}

module.exports = Message;