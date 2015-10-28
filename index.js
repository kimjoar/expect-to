const isPromise = require('is-promise');
const assertions = require('./assertions');
const promises = require('./promises');

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

module.exports = {
    expect, ...assertions, ...promises
};

