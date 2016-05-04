expect-to
=========

expect-to is an assertion library based on pure functions. It is very easy to
extend with new assertions, it can be used in most JavaScript testing
frameworks and it works in both Node.js and browsers.

[Why another assertion library?](#why-a-new-assertion-library)

Installation
------------

```
$ npm install --save-dev expect-to
```

Basic usage
-----------

```javascript
var foo = 'test';
var bar = false;

expect(foo).to(be('test'));
expect(foo).to(not(be('testing')));
expect(bar).to(be(false));
expect(bar).to(not(be(undefined)));
```

Or, e.g. within the Mocha BDD interface:

```javascript
import expect, { not, be } from 'expect-to';

describe('my test', function() {

  it('handles equality checks', function() {
    expect('foo').to(be('foo'));
  });

  it('handles `not` for all assertions', function() {
    expect('foo').to(not(be('bar')));
  });

});
```

Assertions available
--------------------

- [`expect-to-core`][expect-to-core] contains core assertions, such as `be`, `deepEqual`, `match` and `throwError`. Included by default.
- [`expect-to-promises`][expect-to-promises] contains the powerful `eventually` for promises.

Created other assertions on top of expect-to? [Let me know!][pulls]

Creating your own assertions
----------------------------

As an example of how to create an assertion, this is how `be` is implemented:

```javascript
function be(expected) {
  return function({ actual, assert }) {
    return assert(actual === expected,
      ['Expected %j to be %j', actual, expected],
      ['Expected %j not to be %j', actual, expected]);
  }
}
```

And this is how you use it:

```javascript
expect('foo').to(be('foo'));
expect('foo').to(not(be('bar')));

// And just to use the same variable names
// as in the implementation of be:
expect(actual).to(be(expected));
```

You can also write the assertion using arrow functions:

```javascript
const be = expected => ({ actual, assert }) =>
  assert(actual === expected,
    ['Expected %j to be %j', actual, expected],
    ['Expected %j not to be %j', actual, expected])
```

And if you want to create an assertion like `beUndefined`, it would only be:

```javascript
const beUndefined = ({ actual, assert }) =>
  assert(actual === undefined,
    ['Expected %j to be undefined', actual],
    ['Expected %j to not be undefined', actual]);
```

And you can use it like this:

```js
expect(undefined).to(beUndefined);
expect('testing').to(not(beUndefined));
```

Also, what's up with those error messages?

We rely on [`util.format()`][utilfmt] under the hood, so check out those docs
for an explanation of `%j` and the other flags.

Note: You can also return a string if you want. This string
will not be formatted in any way.

Why a new assertion library?
----------------------------

There are [many][chaijs] [assertion][shouldjs] [libraries][expectjs]
[out][powerassert] [there][js-must], but I haven't found one that matches what
I want in an assertion library. This is what I look for:

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

(Yep, I know [Power Assert][powerassert] solves that problem.)

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
[_always_ returns `undefined`][property-access]. And on that note,
what about:

```javascript
var bar = undefined;
bar.should.not.be.ok;
```

This doesn't work as you cannot add properties to `undefined` and `null`.

`expect-to` is my attempt at building an assertion library that solves all of these problems.

[expect-to-core]: https://github.com/kjbekkelund/expect-to-core
[expect-to-promises]: https://github.com/kjbekkelund/expect-to-promises
[pulls]: https://github.com/kjbekkelund/expect-to/pulls
[utilfmt]: https://nodejs.org/api/util.html#util_util_format_format
[chaijs]: http://chaijs.com/
[shouldjs]: https://github.com/shouldjs/should.js
[expectjs]: https://github.com/Automattic/expect.js
[powerassert]: https://github.com/power-assert-js/power-assert
[js-must]: https://github.com/moll/js-must
[property-access]: https://github.com/moll/js-must#asserting-on-property-access
