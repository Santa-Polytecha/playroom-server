let games = [];

exports.games = function () {
    return games;
};

exports.addGame = function (game) {
    games.push(game);
};

exports.removeGame = function (gameName) {
    const index = games.indexOf(games.find(game => {
        return game.gameId === gameName;
    }));
    if(index >= 0)
        games.splice(index, 1)
};

exports.findGame = function (gameName) {
    return games.find(r =>{
        return r.gameId === gameName;
    })
};