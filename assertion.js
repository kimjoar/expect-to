const stringify = require('./stringify');

const defaultOpts = { not: false };

const assertion = test => expected => (actual, opts = defaultOpts) => {
    const result = test({ actual, expected, stringify, ...opts });

    if (result === true || result == null) return;

    return {
        expected: expected,
        actual: actual,
        msg: result
    }
}

module.exports = assertion;
