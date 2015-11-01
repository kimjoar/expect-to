const isDeepEqual = require('deep-equal');

const not = (test) => (obj) =>
  test({ ...obj, assert: obj.assert.not });

const equal = (expected) => ({ actual, assert, stringify }) =>
  assert(actual === expected,
    `Expected ${stringify(actual)} to equal ${stringify(expected)}`,
    `Expected ${stringify(actual)} not to equal ${stringify(expected)}`);

const deepEqual = (expected) => ({ actual, assert, stringify }) =>
  assert(isDeepEqual(actual, expected),
    `Expected ${stringify(actual)} to deep equal ${stringify(expected)}`,
    `Expected ${stringify(actual)} not to deep equal ${stringify(expected)}`)

const beTrue = () => ({ actual, assert, stringify }) =>
  assert(actual === true,
    `Expected ${stringify(actual)} to be true`,
    `Expected ${stringify(actual)} not to be true`);

const beFalse = () => ({ actual, assert, stringify }) =>
  assert(actual === false,
    `Expected ${stringify(actual)} to be false`,
    `Expected ${stringify(actual)} not to be false`);

const beTruthy = () => ({ actual, assert, stringify }) =>
  assert(!!actual,
    `Expected ${stringify(actual)} to be truthy`,
    `Expected ${stringify(actual)} not to be truthy`);

const beFalsy = () => ({ actual, assert, stringify }) =>
  assert(!actual,
    `Expected ${stringify(actual)} to be falsy`,
    `Expected ${stringify(actual)} not to be falsy`);

const beUndefined = () => ({ actual, assert, stringify }) =>
  assert(actual === undefined,
    `Expected ${stringify(actual)} to be undefined`,
    `Expected ${stringify(actual)} not to be undefined`);

const beNull = () => ({ actual, assert, stringify }) =>
  assert(actual === null,
    `Expected ${stringify(actual)} to be null`,
    `Expected ${stringify(actual)} not to be null`);

const contain = (item) => ({ actual: arr, assert, stringify }) =>
  assert(arr.indexOf(item) > -1,
    `Expected ${stringify(arr)} to contain ${stringify(item)}`,
    `Expected ${stringify(arr)} not to contain ${stringify(item)}`);

const beA = (type) => ({ actual, assert, stringify }) => {
};

const haveProperty = (name) => ({ actual, assert, stringify }) => {
};

// exist
// beEmpty
// match

module.exports = { not, equal, beTrue };
