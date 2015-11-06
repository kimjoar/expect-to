expect-to
=========

expect-to is an assertion library based on pure functions. It can be used in
most JavaScript testing frameworks and it works in both Node.js and browsers.

[Why another assertion library?](#why-a-new-assertion-library)

Installation
------------

```
$ npm install --save-dev expect-to expect-to-core
```

Basic usage
-----------

```javascript
var foo = 'test';
var bar = false;

expect(foo).to(equal('test'));
expect(foo).to(not(equal('testing')));
expect(bar).to(beFalse);
expect(bar).to(not(beUndefined));
```

Or, e.g. within the Mocha BDD interface:

```javascript
import expect from 'expect-to';
import { not, equal, beTrue } from 'expect-to-core';

describe('my test', function() {

  it('handles equality checks', function() {
    expect('foo').to(equal('foo'));
  });

  it('handles `not` for all assertions', function() {
    expect('foo').to(not(equal('bar')));
  });

  it('has many other helpers', function() {
    const myVar = true;
    expect(myVar).to(beTrue);
  });

});
```

Assertions available
--------------------

- [`expect-to-core`](https://github.com/kjbekkelund/expect-to-core) contains core assertions, such as `equal`, `deepEqual`, `beTrue`, `beEmpty` and `match`.
- [`expect-to-promises`](https://github.com/kjbekkelund/expect-to-promises) contains assertions for promises, such as `eventually` (...aaand more coming).

Created other assertions on top of expect-to? [Let me know!](https://github.com/kjbekkelund/expect-to/pulls)

Creating your own assertions
----------------------------

As an example of how to create an assertion, this is `equal`:

```javascript
function equal(expected) {
  return function({ actual, assert, stringify }) {
    return assert(actual === expected,
      `Expected ${stringify(actual)} to equal ${stringify(expected)}`,
      `Expected ${stringify(actual)} not to equal ${stringify(expected)}`);
  }
}
```

And this is how you use it:

```javascript
expect('foo').to(equal('foo'));
expect('foo').to(not(equal('bar')));

// And just to use the same variable names
// as in the implementation of equal:
expect(actual).to(equal(expected));
```

You can also write the assertion using arrow functions:

```javascript
const equal = (expected) => ({ actual, assert, stringify }) =>
  assert(actual === expected,
    `Expected ${stringify(actual)} to equal ${stringify(expected)}`,
    `Expected ${stringify(actual)} not to equal ${stringify(expected)}`);
```

And if you want to create an assertion like `beUndefined`, it would only be:

```javascript
const equal = ({ actual, assert, stringify }) =>
  assert(actual === undefined,
    `Expected ${stringify(actual)} to be undefined`,
    `Expected ${stringify(actual)} to not be undefined`);
```

And you can use it like this:

```
expect(undefined).to(beUndefined);
expect('testing').to(not(beUndefined));
```

Why a new assertion library?
----------------------------

There are [many](http://chaijs.com/)
[assertion](https://github.com/shouldjs/should.js)
[libraries](https://github.com/Automattic/expect.js)
[out](https://github.com/power-assert-js/power-assert)
[there](https://github.com/moll/js-must), but I haven't found one that matches
what I want in an assertion library. This is what I look for:

First, I want my assertions to feel like JavaScript, so I've never been a huge
fan of this style of chaining assertions:

```javascript
someVar.should.be.a('string');
should(null).not.be.ok();
should.not.exist(err);
expect(foo).to.be.a('string');
expect(obj).to.have.property('key')
  .with.length(3);
expect(window).not.to.be.an(Image);
```

An assertion library must also have great error messages, which excludes basic
asserts:

```javascript
assert(user.name == 'kim');
assert(typeof user.age == 'number');
```

(Yep, I know [Power Assert](https://github.com/power-assert-js/power-assert)
solves that problem.)

It must also be extremely simple to extend. I want assertions for React,
Sinon.js and others, but they shouldn't be built into the core itself — the
core should be framework agnostic. To me it's important that extensions are
first class members, not something that is tacked onto a prototype or added to
an instance. This exludes things like:

```javascript
beforeEach(function () {
  jasmine.addMatchers({
    toBeDivisibleByTwo: function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: (actual % 2) === 0
          };
        }
      };
    }
  });
});
```

and:

```
chai.use(somePlugin);
```

On that note, I also don't want to mix the test library with the assertion
library. This also excludes things like:

```javascript
test('equal test', function (t) {
    t.plan(1);
    t.equal('test', 'test');
});
```

It _must_ also end up calling a function, not assert on property access. What
happens here?

```javascript
foo.should.be.false;

// or maybe a test with a small typo
bar.should.be.undefied;
```

The latter _doesn't_ fail no matter what `bar` is because it
[_always_ returns `undefined`](https://github.com/moll/js-must#asserting-on-property-access).
And on that note, what about:

```javascript
var bar = undefined;
bar.should.not.be.ok;
```

This doesn't work as you cannot add properties to `undefined` and `null`.

`expect-to` is my attempt at building an assertion library that solves all of these problems.
