expected
========

**WIP** -- I'm still just playing around with some ideas

There's a lot of different assertion libs out there, but none appear to be
based on pure functions. I enjoy:

- Being able to write my own assertions
  ```javascript
  expect(component).to(beAReactComponent());
  ```
- Having great error messages when a test fails, e.g.
  ```
  expected [1,2,3] to contain 4
  ```

This is expected:

```javascript
let { expect, equal, eventually } = require('expected');

describe("expected", function() {

    it("should fail - string", function() {
        expect("test").to(equal("testing"));
    });

    it("should fail - boolean", function() {
        expect(true).to(equal(false));
    });

    it("should fail - promise", function() {
        let promise = new Promise(function(resolve, reject) {
            resolve("promise fail");
        });

        return expect(promise).to(eventually(equal("promise")));
    });

    it("should run - promise", function() {
        let promise = new Promise(function(resolve, reject) {
            resolve("promise");
        });

        return expect(promise).to(eventually(equal("promise")));
    });

    it("should run - string", function() {
        expect("test").to(equal("test"));
    });

});
```

As an example of you to create an assertion, this is `equal`:

```javascript
function equal(expected) {
    return function(actual) {
        if (expected !== actual) {
            return {
                expected: expected,
                actual: actual,
                msg: "Expected '" + actual + "' to equal '" + expected + "'";
            };
    }
}
```
