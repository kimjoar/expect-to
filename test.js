'use strict';

let assert = require('assert');
let Promise = require('bluebird');
let { expect, equal, eventually, beFulfilled, beRejected } = require('./');

const assertSuccess = res => {
    assert(res === undefined);
}

const assertError = (res, obj) => {
    assert(typeof res === "object");
    assert.equal(res.expected, obj.expected);
    assert.equal(res.actual, obj.actual);
}

describe("expected", function() {

    describe("expect", function() {
        it('test', function() {
            // expect("test").to(equal("test"));
        });
    });

    describe("equal", function() {
        it("succeeds when strings are equal", function() {
            let res = equal("test")("test");

            assertSuccess(res);
        });

        it("fails when strings are not equal", function() {
            let res = equal("test")("testing");

            assertError(res, {
                expected: "test",
                actual: "testing"
            });
        });

        it("fails when booleans are not equal", function() {
            let res = equal(false)(true);

            assertError(res, {
                expected: false,
                actual: true
            });
        });

        it("succeeds when same reference", function() {
            let test = { name: "kim" };
            let res = equal(test)(test);

            assertSuccess(res);
        });

        it("fails when different references", function() {
            let ref1 = { name: "kim" };
            let ref2 = { name: "kim" };
            let res = equal(ref1)(ref2);

            assertError(res, {
                expected: ref1,
                actual: ref2
            });
        });
    });

    describe("promise", function() {
        it("test to", function(done) {
            let resolvedPromise = Promise.resolve("promise");

            let fail = actual => actual.then(val => {
                return {
                    msg: `${val} failed`
                }
            });

            expect(resolvedPromise)
                .to(fail)
                .then(
                    res => {
                        done(new Error("`to` unexpectedly succeeded with promise"));
                    },
                    err => {
                        assert(err instanceof Error);
                        assert.equal(err.message, "promise failed");
                        done();
                    }
                );
        });

        it("is fulfilled when resolved", function() {
            let promise = Promise.resolve("promise");
            return expect(promise).to(beFulfilled());
        });

        it("is not fulfilled when rejected", function(done) {
            let promise = Promise.reject("promise");
            expect(promise).to(beFulfilled()).catch(function(err) {
                assert(err instanceof Error);
                done();
            });
        });

        it("is rejected when rejected", function() {
            let promise = Promise.reject("rejected promise");
            return expect(promise).to(beRejected());
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
                if (arr.indexOf(item) < 0) {
                    return {
                        expected: item,
                        actual: arr,
                        msg: `Expected ${arr} to contain ${item}`
                    };
                }
            };
        }

        expect([1,2,3]).to(contain(2));
        expect([1,2,3]).to(contain(4));
    });

});

