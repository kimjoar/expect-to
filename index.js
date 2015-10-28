const curry = require('lodash.curry');
const isPromise = require('is-promise');
const stringify = require('./stringify');

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

/*** ASSERTIONS ***/

const defaultOpts = { not: false };

const assertion = cb => (expected, opts = defaultOpts) => actual => {
    var res = cb({
        actual,
        expected,
        stringify,
        ...opts
    });

    if (res === false || res == null) return;

    return {
        expected: expected,
        actual: actual,
        msg: res
    }
}

const equal = assertion(({ actual, expected, not, stringify }) => {
    if (not && expected === actual) {
        return `Expected ${stringify(actual)} not to equal ${stringify(expected)}`
    }
    if (expected !== actual) {
        return `Expected ${stringify(actual)} to equal ${stringify(expected)}`
    }
});

const not = actual => cb => {
    return cb(actual, { not: true });
}

const beTrue = assertion(({ actual, not, stringify }) => {
    if (not && actual === true) {
        return `Expected ${stringify(actual)} not to be true`
    }
    if (actual !== true) {
        return `Expected ${stringify(actual)} to be true`
    }
});

assertion.stringify = stringify;
assertion.not = not => not ? "not " : "";

/*** PROMISE ASSERTIONS ***/

function eventually(test) {
    return promise => promise.then(test,
        () => ({
            msg: 'Expected to eventually resolve, but was rejected'
        })
    );
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
    expect, equal,
    eventually, beFulfilled, beRejected
};

