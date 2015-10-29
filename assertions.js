const deepEqualTest = require('deep-equal');

const assertion = require('./assertion');

const not = cb => actual => {
    return cb(actual, { not: true });
}

const equal = assertion(({ actual, expected, not, stringify }) => {
    const isEqual = expected === actual;
    if (not && isEqual) {
        return `Expected ${stringify(actual)} not to equal ${stringify(expected)}`
    }
    if (!not && !isEqual) {
        return `Expected ${stringify(actual)} to equal ${stringify(expected)}`
    }
});

const deepEqual = assertion(({ actual, expected, not, stringify }) => {
    const isDeepEqual = deepEqualTest(actual, expected);
    if (not && isDeepEqual) {
        return `Expected ${stringify(actual)} not to deep equal ${stringify(expected)}`
    }
    if (!not && !isDeepEqual) {
        return `Expected ${stringify(actual)} to deep equal ${stringify(expected)}`
    }
});

const beTrue = assertion(({ actual, not, stringify }) => {
    const isTrue = actual === true;

    if (not && isTrue) {
        return `Expected ${stringify(actual)} not to be true`
    }
    if (!not && !isTrue) {
        return `Expected ${stringify(actual)} to be true`
    }
});

// anyOf
// allOf
// beNull
// exist
// beUndefined
// beEmpty

module.exports = { not, equal, beTrue };
