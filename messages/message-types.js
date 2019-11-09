exports.types = {
    //room handling
    create: 'create',
    join: 'join',

    //room users handling
    userEnter: 'userEnter',
    userLeave: 'userLeave',

    //room message handling
    newMessage: 'newMessage',

    default: 'default',
};

exports.hasType = function (param) {
    // TODO : test if is right typed else throw exception
    return true;
};