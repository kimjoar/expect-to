expect-to
=========

expect-to is an assertion library based on pure functions. It works for both
Node.js and the browser, it can be used in any JavaScript testing framework and
it works in all new browsers.

[Why another assertion library?](#why-a-new-assertion-library)

Installation
------------

```
$ npm install --save-dev expect-to expect-to-core
```

The library relies on multiple new JavaScript features so you will need to
transpile the code. If you are using Babel I suggest including the presets
`es2015` and `stage-2`.

Basic usage
-----------

```javascript
expect('test').to(equal('test'));
expect('test').to(not(equal('testing')));
expect(true).to(beTrue);
expect(true).to(not(beUndefined));
```

Or, e.g. within the Mocha BDD interface:

```javascript
import expect from 'expect-to';
import { not, equal, beTrue } from 'expect-to-core';

describe('my test', function() {

  it('handles equality checks', function() {
    expect('test').to(equal('test'));
  });

  it('handles not for all assertions', function() {
    expect('test').to(not(equal('testing')));
  });

  it('has many other helpers', function() {
    expect(true).to(beTrue);
  });

});
```

Assertions available
--------------------

- [`expect-to-core`](https://github.com/kjbekkelund/expect-to-core) contains core assertions, such as `equal`, `deepEqual`, `beTrue`, `beEmpty` and `match`.
- FIX: [`expect-to-promises`]() contains handling of promises, such as `eventually`, `beResolved` and `beRejected`.

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
expect('test').to(equal('test'));
expect('test').to(not(equal('testing')));
```

You can also write the assertion using arrow functions:

```javascript
const equal = (expected) => ({ actual, assert, stringify }) =>
  assert(actual === expected,
    `Expected ${stringify(actual)} to equal ${stringify(expected)}`,
    `Expected ${stringify(actual)} not to equal ${stringify(expected)}`);
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

On that note, I also don't want to mix the test library with the assertion
library. This also ecxludes things like:

```javascript
test('equal test', function (t) {
    t.plan(1);
    t.equal('test', 'test');
});
```

It _must_ also end up calling a function, not assert on property access. What
happens here?

```javascript
myVar.should.be.false;

// or maybe a test with a small typo
myVar.should.be.undefied;
```

The latter _doesn't_ fail no matter what `myVar` is because it
[_always_ returns `undefined`](https://github.com/moll/js-must#asserting-on-property-access).
And on that note, what about:

```javascript
undefined.should.not.be.ok;
```

This doesn't work as you cannot add properties to `undefined` and `null`.

And on that example, I never remember what `ok` actually means without checking the docs.

`expect-to` is my attempt at building an assertion library that solves all of these problems.
