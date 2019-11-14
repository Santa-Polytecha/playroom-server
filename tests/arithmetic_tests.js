// déclaration d'une suite de tests
describe("Arithmetic tests", function() {
    // avant chaque test
    beforeEach(function() {
        // whatever
    });

    // définition d'un test
    it("2 + 2 should be equal to 4", function() {
        var a = 2 * 2;
        expect(a).toEqual(4);
    });

});