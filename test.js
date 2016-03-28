/* eslint-env mocha */

import test from 'assert'
import sinon from 'sinon'

import { formatMsg } from './src/msg'
import * as msg from './src/msg'
import expect, { be, not } from './src'

const stubs = []

describe('expect-to', () => {
  it('triggers callback', () => {
    let count = 0
    expect('test').to(() => {
      count++
    })
    test.equal(count, 1)
  })

  it('injects actual, assert and stringify', () => {
    expect('test').to(({ actual, assert, stringify }) => {
      test.equal(actual, 'test')
      test.equal(typeof assert, 'function')
      test.equal(stringify('test'), '"test"')
      test.equal(stringify([1, 2, 3]), '[\n  1\n  2\n  3\n]')
    })
  })

  it('throws when assert is false', () => {
    const assertion = ({ assert }) => {
      return assert(false, 'failed message', 'not message')
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.message === 'failed message'
    )
  })

  it('throws when not and assert is true', () => {
    const assertion = ({ assert }) => {
      return assert.not(true, 'failed message', 'not message')
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.message === 'not message'
    )
  })

  it('sets showDiff=true if both expected and actual in error', () => {
    const assertion = ({ assert }) => {
      const expected = 'testing'
      return assert(false, 'fail', 'not', expected)
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.actual === 'test' && err.expected === 'testing' && err.showDiff === true
    )
  })

  it('sets showDiff=false if only actual in error', () => {
    const assertion = ({ assert }) => {
      return assert(false, 'fail', 'not')
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.actual === 'test' && err.expected === undefined && err.showDiff === false
    )
  })

  it('allows chaining', () => {
    let count = 0
    expect('test')
      .to(() => {
        count++
      })
      .to(() => {
        count++
      })
      .to(() => {
        count++
      })

    test.equal(count, 3)
  })

  it('exports core methods', () => {
    expect('foo').to(be('foo'))
    expect('foo').to(not(be('bar')))
  })

  describe('assert msg', () => {
    beforeEach(() => stubs.push(sinon.spy(msg, 'formatMsg')))
    afterEach(() => stubs.splice(0).forEach((s) => s.restore()))

    it('formats assertion messages only when necesarry', function () {
      expect().to(({ assert }) => assert(true, ['msg %d', 1], 'msgNot', 1))
      sinon.assert.notCalled(msg.formatMsg)

      try {
        expect().to(({ assert }) => assert(false, ['msg %d', 2], 'msgNot', 2))
      } catch (err) {
        expect(err.message).to(be('msg 2'))
      }

      sinon.assert.calledOnce(msg.formatMsg)
    })
  })

  describe('msg formatting', () => {
    describe('%j placeholder', () => {
      it('stringifies the arg', () => {
        const arg = { baz: 1 }
        const out = formatMsg(['foo %j bar', arg])
        test.equal(out, `foo {\n  "baz": 1\n} bar`)
      })
    })

    describe('%s placeholder', () => {
      it('stringifies with string constructor', () => {
        test.equal(formatMsg(['%s %s', {}]), '[object Object] %s')
      })

      it('stringifies with string constructor', () => {
        test.equal(formatMsg(['-> %s', 'string']), '-> string')
      })
    })

    describe('%d placeholder', () => {
      it('formats the arg as a number', () => {
        test.equal(formatMsg(['(%d)', {}]), '(NaN)')
      })

      it('formats the arg as a number', () => {
        test.equal(formatMsg(['** %d', Math.PI]), '** 3.141592653589793')
      })

      it('formats the arg as a number', () => {
        test.equal(formatMsg(['& %d &', 55]), '& 55 &')
      })

      it('formats the arg as a number', () => {
        test.equal(formatMsg(['%d', /not a number/]), 'NaN')
      })
    })
  })

  describe('mocha compat', () => {
    function failAssert (errMsg, expected) {
      expect({ a: 1 }).to(({ assert }) =>
        assert(false, errMsg, 'not ' + errMsg, expected)
      )
    }

    context('error message starts with "expected"', () => {
      context('assertion has an expected value', () => {
        it('prefixes error messages', () => {
          try {
            failAssert('expected value', 1)
            test.ok(false, 'Expected assertion to fail')
          } catch (err) {
            test.deepEqual(err.message, 'expect-to assertion failure: expected value')
          }
        })
      })

      context('assertion has no expected value', () => {
        it('does not prefix error messages', () => {
          try {
            failAssert('expected nothing')
            test.ok(false, 'Expected assertion to fail')
          } catch (err) {
            test.deepEqual(err.message, 'expected nothing')
          }
        })
      })
    })

    context('error message starts with "Expected"', () => {
      context('assertion has an expected value', () => {
        it('prefixes error messages', () => {
          try {
            failAssert('Expected something', 1)
            test.ok(false, 'Expected assertion to fail')
          } catch (err) {
            test.deepEqual(err.message, 'expect-to assertion failure: expected something')
          }
        })
      })

      context('assertion has no expected value', () => {
        it('does not prefix error messages', () => {
          try {
            failAssert('Expected nothing')
            test.ok(false, 'Expected assertion to fail')
          } catch (err) {
            test.deepEqual(err.message, 'Expected nothing')
          }
        })
      })
    })
  })
})
