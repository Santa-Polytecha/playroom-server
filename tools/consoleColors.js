const colors = require('../tools/colors.js');

exports.consoleColors = {
    InfoColor: colors.references.FgWhite + '%s' + colors.references.Reset,
    ServerColor : colors.references.FgCyan + '%s' + colors.references.Reset,
    ServerDoneColor : colors.references.BgCyan + '%s' + colors.references.Reset,
    RoomColor : colors.references.FgMagenta + '%s' + colors.references.Reset,
    RoomDoneColor : colors.references.BgMagenta + '%s' + colors.references.Reset,
    GameColor : colors.references.FgGreen + '%s' + colors.references.Reset,
    GameDoneColor : colors.references.BgGreen + '%s' + colors.references.Reset,
    Error : colors.references.FgRed + '%s' + colors.references.Reset,
}