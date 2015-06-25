let curry = require('lodash.curry');
let isPromise = require('is-promise');

function expect(actual) {
    return {
        to: test => {
            let res = test(actual);

            if (isPromise(res)) {
                return res.then(
                    throwIfError,
                    throwIfError
                );
            } else {
                throwIfError(res);
            }
        }
    }
}

function throwIfError(res) {
    if (res !== undefined) {
        let err = new Error(res.msg);
        err.expected = res.expected;
        err.actual = res.actual;
        err.showDiff = true;
        throw err;
    }
}

/*** HELPERS ***/

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
    if (expected !== actual) {
        return {
            expected: expected,
            actual: actual,
            msg: `Expected ${output(actual)} to equal ${output(expected)}`
        };
    }
});

/*** PROMISE ASSERTIONS ***/

function eventually(test) {
    return promise => promise.then(test,
        () => {
            return {
                msg: 'Expected to eventually resolve, but was rejected'
            };
        });
}

function beFulfilled() {
    return actual => actual.then(
        () => undefined,
        () => {
            return {
                msg: 'Expected promise to be fulfilled'
            };
        }
    );
}

function beRejected() {
    return actual => actual.then(
        () => {
            return {
                msg: 'Expected promise to be rejected'
            };
        },
        () => undefined
    );
}

function beRejectedWith(test) {
}

module.exports = {
    expect, assertion,
    equal,
    eventually, beFulfilled, beRejected
};

