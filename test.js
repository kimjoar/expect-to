let Promise = require('bluebird');
let { expect, equal, eventually, assert, beFulfilled, assertion } = require('./');

describe("expected", function() {

    describe("equal", function() {
        it("succeeds when strings are equal", function() {
            expect("test").to(equal("test"));
        });

        it("fails when strings are not equal", function() {
            expect("test").to(equal("testing"));
        });

        it("fails when booleans are not equal", function() {
            expect(true).to(equal(false));
        });

        it("succeeds when same reference", function() {
            let test = {
                name: "kim"
            };

            expect(test).to(equal(test));
        });

        it("fails when different references", function() {
            expect({ name: "kim" }).to(equal({ name: "kim" }));
        });
    });

    describe("promise", function() {
        it("is fulfilled when resolved", function() {
            let promise = Promise.resolve("promise");
            return expect(promise).to(beFulfilled());
        });

        it("is not fulfilled when rejected", function() {
            let promise = Promise.reject("promise");
            return expect(promise).to(beFulfilled());
        });

        it("is eventually equal when resolved with equal content", function() {
            let promise = Promise.resolve("promise");
            return expect(promise).to(eventually(equal("promise")));
        });

        it("is not eventually equal when resolved with different content", function() {
            let promise = Promise.resolve("promise fail")
            return expect(promise).to(eventually(equal("promise")));
        });

        it("is not eventually equal when promise rejected, but have equal content", function() {
            let promise = Promise.reject("promise");
            return expect(promise).to(eventually(equal("promise")));
        });

    });

    it("handles own assertion", function() {
        let contain = function(item) {
            return function(arr) {
                return assert(arr.indexOf(item) >= 0, {
                    expected: item,
                    actual: arr,
                    msg: `Expected ${arr} to contain ${item}`
                });
            }
        }

        expect([1,2,3]).to(contain(2));
        expect([1,2,3]).to(contain(4));
    });

    it("creates own assertion with helper", function() {
        let contain = assertion((item, arr) => {
            return assert(arr.indexOf(item) >= 0, {
                expected: item,
                actual: arr,
                msg: `Expected ${arr} to contain ${item}`
            });
        });

        expect([5,6,7]).to(contain(5));
        expect([5,6,7]).to(contain(9));
    });

});

