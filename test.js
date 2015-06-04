let { expect, equal } = require('./');

describe("expected", function() {

    it("should fail - string", function() {
        expect("test").to(equal("testing"));
    });

    it("should fail - boolean", function() {
        expect(true).to(equal(false));
    });

    it("should run", function() {
        expect("test").to(equal("test"));
    });

});

