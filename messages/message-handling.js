const Message = require('../messages/message.js');
const MessageTypesHandler = require('../messages/message-types.js');

exports.testAndExtractFromJson = function(strMessage){
    let body = {};
    try {
        body = JSON.parse(strMessage);
    } catch (e) {
        throw "Message is not a valid Json String!";
    }

    if(body.length === 0)
        throw "Message is empty!";

    if(body.user === undefined)
        throw "Message sender could not be found!";

    if(body.type.length === 0)
        throw "Message type could not be found!";

    if(body.content === undefined)
        throw "Message main content could not be found!";

    if(!MessageTypesHandler.hasType())
        throw "Message type is not supported!";

    return new Message(body.user, parseInt(body.type), body.content, body.room)
};