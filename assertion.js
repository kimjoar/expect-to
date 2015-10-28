const stringify = require('./stringify');

const defaultOpts = { not: false };

const assertion = cb => (expected, opts = defaultOpts) => actual => {
    var result = cb({ actual, expected, stringify, ...opts });

    if (result === true || result == null) return;

    return {
        expected: expected,
        actual: actual,
        msg: result
    }
}

assertion.stringify = stringify;

module.exports = assertion;
