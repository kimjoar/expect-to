let { expect, equal } = require('./');

describe("expected", function() {

    it("should fail", function() {
        expect("test").to(equal("testing"));
    });

    it("should run", function() {
        expect("test").to(equal("test"));
    });

});

