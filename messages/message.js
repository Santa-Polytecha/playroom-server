class Message {

    constructor(user, type, content, room) {
        this.user = user;
        this.type = type;
        this.content = content;
        this.room = room;
    }

    toJson(){
        return {
            user : this.user,
            type : this.type,
            room : this.room,
            content: this.content
        }
    }

    toJsonString(){
        return JSON.stringify(this.toJson());
    }

}

module.exports = Message;