const assertion = require('./assertion');

const not = actual => cb => {
    return cb(actual, { not: true });
}

const equal = assertion(({ actual, expected, not, stringify }) => {
    if (not && expected === actual) {
        return `Expected ${stringify(actual)} not to equal ${stringify(expected)}`
    }
    if (expected !== actual) {
        return `Expected ${stringify(actual)} to equal ${stringify(expected)}`
    }
});

const beTrue = assertion(({ actual, not, stringify }) => {
    if (not && actual === true) {
        return `Expected ${stringify(actual)} not to be true`
    }
    if (actual !== true) {
        return `Expected ${stringify(actual)} to be true`
    }
});

module.exports = { not, equal, beTrue };
