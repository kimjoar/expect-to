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

Basic usage
-----------

```javascript
expect('test').to(equal('test'));
expect('test').to(not(equal('testing')));
expect(true).to(beTrue);
expect(true).to(not(beUndefined));
```

Or, in a bigger example:

```javascript
import expect from 'expect-to';
import { equal, beTrue } from 'expect-to-core';

describe('my test', function() {

  it('should succeed when strings are equal', function() {
    expect('test').to(equal('test'));
  });

  it('with not, should succeed when strings are different', function() {
    expect('test').to(not(equal('testing')));
  });

  it('should be true', function() {
    expect(true).to(beTrue);
  });

});
```

As an example of you to create an assertion, this is `equal`:

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

Assertions available
--------------------

- FIX: [`expect-to-core`]() contains core assertions, such as `equal`, `beTrue`, `beEmpty` and `contains`.
- FIX: [`expect-to-promises`]() contains handling of promises, such as `beFulfilled` and `beRejected`.

Written your own? Let me know!

Why a new assertion library?
----------------------------

There are [many](http://chaijs.com/)
[assertion](https://github.com/shouldjs/should.js)
[libraries](https://github.com/Automattic/expect.js) out there, but I haven't
found one that matches what I want in an assertion library. These are _not_
complaints but the existing libraries, they are different philosophies. What
works for me is not necessarily the right choice for you.

First of, I want them to feel like JavaScript, e.g. no chaining of assertions:

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
assert('kim' == user.name);
assert('number' == typeof user.age);
```

It must also be extremely simple to extend. I want assertions for React,
Sinon.js and others, but they shouldn't be built into the core itself — the
core should be framework agnostic. But to me it's important that extensions
are first class members, not something that is tacked onto some prototype or
added to an instance. This exludes things like:

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
library. This also exludes things like:

```javascript
test('equal test', function (t) {
    t.plan(1);
    t.equal('test', 'test');
});
```

It _must_ also end up calling a function. What happens here?

```javascript
myVar.should.be.false;

// or maybe a test with a small typo
myVar.should.be.undefied;
```

The latter _doesn't_ fail no matter what `myVar` is because it _always_ returns
`undefined`. And on that note, what about:

```javascript
undefined.should.not.be.ok;
```

This doesn't work as you cannot add functions to `undefined` and `null`.

