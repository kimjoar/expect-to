import isPromise from 'is-promise';
import stringify from './stringify';

function assert(result, msg, err, expected) {
  if (result === true) return;
  return { msg, expected };
}

assert.not = function assertNot(result, msg, err, expected) {
  if (result === false) return;
  return { msg: err, expected };
}

function expect(actual) {
  return {
    to: test => {
      const res = test({ actual, assert, stringify });
      const throwIf = throwIfError(actual);

      if (isPromise(res)) {
        return res.then(
          throwIf,
          throwIf
        );
      }
      else {
        throwIf(res);
      }
    }
  }
}

function throwIfError(actual) {
  return function(res) {
    if (res !== undefined) {
      const err = new Error(res.msg);
      err.expected = res.expected;
      err.actual = actual;
      err.showDiff = true;
      throw err;
    }
  }
}

export default expect;
