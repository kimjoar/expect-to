import isPromise from 'is-promise'
import AssertionError from 'assertion-error'

import stringify from './stringify'
import { formatMsg } from './msg'

function assert (result, msg, err, expected) {
  if (result !== true) {
    return { msg: formatMsg(msg), expected }
  }
}

assert.not = function assertNot (result, msg, msgNot, expected) {
  if (result !== false) {
    return { msg: formatMsg(msgNot), expected }
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

    let { expected, msg } = res
    const showDiff = expected !== undefined

    if (showDiff) {
      // if the error starts with "expected" and we can show a diff,
      // then prefix the error message with `\w+: expected` (lower-case e)
      // and mocha will drop everything after the :
      // https://github.com/mochajs/mocha/blob/c0f9be244bff479e948f59d1bdb825a45c2cb40c/lib/reporters/base.js#L208-L209

      if (msg.match(/^expected /i)) {
        msg = `expect-to assertion failure: expected ${msg.slice(9)}`
      }
    }

    throw new AssertionError(msg, { showDiff, actual, expected })
  }
}

export default expect
export * from 'expect-to-core'
