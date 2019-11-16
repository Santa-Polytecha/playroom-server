

exports.generateName = function () {
    //return Date.now();
    let length=4; // length should be less than 16
    return Math.random().toString(36).substr(2, length).toUpperCase()
};