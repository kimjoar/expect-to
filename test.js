/* eslint-env mocha */

import test from 'assert'
import expect from './src'

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

  it('includes expected and actual in error if expected is passed on', () => {
    const assertion = ({ assert }) => {
      const expected = 'testing'
      return assert(false, 'fail', 'not', expected)
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.actual === 'test' && err.expected === 'testing' && err.showDiff === true
    )
  })

  it('does not include expected and actual in error if expected is not passed on', () => {
    const assertion = ({ assert }) => {
      return assert(false, 'fail', 'not')
    }

    test.throws(
      () => expect('test').to(assertion),
      (err) => err.actual === undefined && err.expected === undefined && err.showDiff === undefined
    )
  })
})
