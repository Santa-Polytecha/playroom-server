module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
             'node_modules/*.js', // on référence les librairies //TODO: verifier cette ligne, pas sur que ce soit nécessaire
            '/*.js', // ... le code source
            'tests/*.js' // ... et les tests unitaires
        ],
        exclude: [],
        reporters: ['progress'], // karma affichera les résultats des tests dans la console
        browsers: ['PhantomJS'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],
        singleRun: true,
        port: 9876
    })
};