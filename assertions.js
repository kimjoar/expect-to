const deepEqualTest = require('deep-equal');

const assertion = require('./assertion');

const not = test => actual => test(actual, { not: true });

const equal = assertion(({ actual, expected, not, stringify }) => {
    const isEqual = expected === actual;
    if (not && isEqual) {
        return `Expected ${stringify(actual)} not to equal ${stringify(expected)}`;
    }
    if (!not && !isEqual) {
        return `Expected ${stringify(actual)} to equal ${stringify(expected)}`;
    }
});

const deepEqual = assertion(({ actual, expected, not, stringify }) => {
    const isDeepEqual = deepEqualTest(actual, expected);
    if (not && isDeepEqual) {
        return `Expected ${stringify(actual)} not to deep equal ${stringify(expected)}`;
    }
    if (!not && !isDeepEqual) {
        return `Expected ${stringify(actual)} to deep equal ${stringify(expected)}`;
    }
});

const beTrue = assertion(({ actual, not, stringify }) => {
    const isTrue = actual === true;

    if (not && isTrue) {
        return `Expected ${stringify(actual)} not to be true`;
    }
    if (!not && !isTrue) {
        return `Expected ${stringify(actual)} to be true`;
    }
});

const beFalse = assertion(({ actual, not, stringify }) => {
    const isFalse = actual === false;

    if (not && isFalse) {
        return `Expected ${stringify(actual)} not to be false`;
    }
    if (!not && !isFalse) {
        return `Expected ${stringify(actual)} to be false`;
    }
});

const beTruthy = assertion(({ actual, not, stringify }) => {
    const isTruthy = !!actual;

    if (not && isTruthy) {
        return `Expected ${stringify(actual)} not to be truthy`;
    }
    if (!not && !isTruthy) {
        return `Expected ${stringify(actual)} to be truthy`;
    }
});

const beFalsy = assertion(({ actual, not, stringify }) => {
    const isFalsy = !actual;

    if (not && isFalsy) {
        return `Expected ${stringify(actual)} not to be falsy`;
    }
    if (!not && !isFalsy) {
        return `Expected ${stringify(actual)} to be falsy`;
    }
});

const beUndefined = assertion(({ actual, not, stringify }) => {
    const isUndefined = actual === undefined;

    if (not && isUndefined) {
        return `Expected ${stringify(actual)} not to be undefined`;
    }
    if (!not && !isUndefined) {
        return `Expected ${stringify(actual)} to be undefined`;
    }
});

const beNull = assertion(({ actual, not, stringify }) => {
    const isNull = actual === null;

    if (not && isNull) {
        return `Expected ${stringify(actual)} not to be null`;
    }
    if (!not && !isNull) {
        return `Expected ${stringify(actual)} to be null`;
    }
});

const contain = assertion(({ actual, expected, not, stringify }) => {
    const arr = expected;
    const item = actual;

    const containsItem = arr.indexOf(item) > -1;

    if (not && containsItem) {
        return `Expected ${stringify(arr)} not to contain ${stringify(item)}`;
    }
    if (!not && !containsItem) {
        return `Expected ${stringify(arr)} to contain ${stringify(item)}`;
    }
});

const beA = assertion(({ actual, expected, not, stringify }) => {
});

const haveProperty = assertion(({ actual, expected, not, stringify }) => {
});

// exist
// beEmpty
// match

module.exports = { not, equal, beTrue };
