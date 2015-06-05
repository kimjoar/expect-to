let Promise = require("bluebird");
let { expect, equal, eventually } = require('./');

describe("expected", function() {

    it("should fail - string", function() {
        expect("test").to(equal("testing"));
    });

    it("should fail - boolean", function() {
        expect(true).to(equal(false));
    });

    it("should fail - promise", function() {
        let promise = new Promise(function(resolve, reject) {
            resolve("promise fail");
        });

        return expect(promise).to(eventually(equal("promise")));
    });

    it("should run - promise", function() {
        let promise = new Promise(function(resolve, reject) {
            resolve("promise");
        });

        return expect(promise).to(eventually(equal("promise")));
    });

    it("should run", function() {
        expect("test").to(equal("test"));
    });

});

