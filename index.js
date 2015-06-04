function expect(actual, prepend) {
    return {
        to: function(test) {
            let res = test(actual);

            if (res === undefined) return;

            let err = new Error(res.msg);
            err.expected = res.expected;
            err.actual = res.actual;
            err.showDiff = true;
            throw err;
        }
    }
}

function assert(passed, opts = {}) {
    if (passed === true) return;

    return opts;
}

function equal(expected) {
    return function(actual) {
        return assert(expected === actual, {
            expected: expected,
            actual: actual,
            msg: `Expected ${output(actual)} to equal ${output(expected)}`
        });
    }
}

function output(obj) {
    if (typeof obj === "string") {
        return `'${obj}'`;
    }
    return obj;
}

module.exports = { expect, equal };

