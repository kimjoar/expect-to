let isPromise = require('is-promise');

function expect(actual) {
    return {
        to: function(test) {
            let res = test(actual);

            if (isPromise(res)) {
                return res.then(throwIfError);
            } else {
                return throwIfError(res);
            }
        }
    }
}

function throwIfError(res) {
    if (res === undefined) return;

    let err = new Error(res.msg);
    err.expected = res.expected;
    err.actual = res.actual;
    err.showDiff = true;
    throw err;
}

function assert(passed, opts = {}) {
    if (passed !== true) {
        return opts;
    }
}

function equal(expected) {
    return actual => assert(expected === actual, {
        expected: expected,
        actual: actual,
        msg: `Expected ${output(actual)} to equal ${output(expected)}`
    });
}

function eventually(test) {
    return promise => promise.then(test);
}

function output(obj) {
    if (typeof obj === "string") {
        return `'${obj}'`;
    }
    return obj;
}

module.exports = { expect, equal, eventually };

