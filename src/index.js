import isPromise from 'is-promise'
import AssertionError from 'assertion-error'

import stringify from './stringify'

function assert (result, msg, err, expected) {
  if (result !== true) {
    return { msg, expected }
  }
}

assert.not = function assertNot (result, msg, msgNot, expected) {
  if (result !== false) {
    return { msg: msgNot, expected }
  }
}

function expect (actual) {
  return {
    to (test) {
      const res = test({ actual, assert, stringify })
      const throwIfError = throwIfErrorFn(actual)

      if (isPromise(res)) {
        return res.then(
          throwIfError,
          throwIfError
        )
      } else {
        throwIfError(res)
      }

      return this
    }
  }
}

function throwIfErrorFn (actual) {
  return function (res) {
    if (res === undefined) return

    const err = new AssertionError(res.msg, {
      actual: actual,
      expected: res.expected,
      showDiff: res.expected !== undefined
    })

    throw err
  }
}

export default expect
