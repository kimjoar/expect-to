let curry = require('lodash.curry');
let isPromise = require('is-promise');

function expect(actual) {
    return {
        to: test => {
            let res = test(actual);

            if (isPromise(res)) {
                return res.then(throwIfError, handleRejectedPromise);
            } else {
                throwIfError(res);
            }
        }
    }
}

function handleRejectedPromise(val) {
    throwError({
        msg: `Expected promise to resolve, but was rejected with ${output(val)}`
    });
}

function throwIfError(res) {
    if (res !== undefined) throwError(res);
}

function throwError(res) {
    let err = new Error(res.msg);
    err.expected = res.expected;
    err.actual = res.actual;
    err.showDiff = true;
    throw err;
}

function eventually(test) {
    return promise => promise.then(test);
}

function assert(passed, opts = {}) {
    if (passed !== true) {
        return opts;
    }
}

function output(obj) {
    if (typeof obj === "string") {
        return `'${obj}'`;
    }
    return obj;
}

function assertion(fn) {
    return curry(fn, 2);
}

/*** ASSERTIONS ***/

const equal = assertion((expected, actual) => {
    return assert(expected === actual, {
        expected: expected,
        actual: actual,
        msg: `Expected ${output(actual)} to equal ${output(expected)}`
    });
});

/*** PROMISE ASSERTIONS ***/

function beFulfilled() {
    return actual => actual.then(
        () => undefined,
        () => {
            throwError({
                msg: 'Expected promise to be fulfilled'
            });
        }
    );
}

function beRejected() {
}

function beRejectedWith(test) {
}

module.exports = {
    expect, assert, assertion,
    equal,
    eventually, beFulfilled
};

