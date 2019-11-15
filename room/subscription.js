class Subscription {

    constructor(client) {
        this.client = client;
    }

    callback() {
        console.log("Message")
    }

    bind() {
        this.client.on("message", this.callback)
    };

}

module.exports = Subscription;