const assert = require('assert');
const Promise = require('bluebird');
const { assertion, expect, not, equal, eventually, beFulfilled, beRejected } = require('./');

const assertSuccess = res => {
    assert(res === undefined);
}

const assertError = (res, obj) => {
    assert(typeof res === 'object');
    assert.equal(res.expected, obj.expected);
    assert.equal(res.actual, obj.actual);
}

describe('expected', () => {

    describe('expect', () => {
        it('test', () => {
            expect('test').to(equal('test'));
        });

        it('test with not', () => {
            expect('test').to(not(equal('testing')));
        });
    });

    describe('equal', () => {
        it('succeeds when strings are equal', () => {
            const res = equal('test')('test');

            assertSuccess(res);
        });

        it('fails when strings are not equal', () => {
            const res = equal('test')('testing');

            assertError(res, {
                expected: 'test',
                actual: 'testing'
            });
        });

        it('fails when booleans are not equal', () => {
            const res = equal(false)(true);

            assertError(res, {
                expected: false,
                actual: true
            });
        });

        it('succeeds when same reference', () => {
            const test = { name: 'kim' };
            const res = equal(test)(test);

            assertSuccess(res);
        });

        it('fails when different references', () => {
            const ref1 = { name: 'kim' };
            const ref2 = { name: 'kim' };
            const res = equal(ref1)(ref2);

            assertError(res, {
                expected: ref1,
                actual: ref2
            });
        });
    });

    describe('promise', () => {
        it('test to', done => {
            const resolvedPromise = Promise.resolve('promise');

            const fail = actual => actual.then(val => {
                return {
                    msg: `${val} failed`
                }
            });

            expect(resolvedPromise)
                .to(fail)
                .then(
                    res => {
                        done(new Error('`to` unexpectedly succeeded with promise'));
                    },
                    err => {
                        assert(err instanceof Error);
                        assert.equal(err.message, 'promise failed');
                        done();
                    }
                );
        });

        it('is fulfilled when resolved', () => {
            const promise = Promise.resolve('promise');
            return expect(promise).to(beFulfilled());
        });

        it('is not fulfilled when rejected', done => {
            const promise = Promise.reject('promise');
            expect(promise).to(beFulfilled()).catch(err => {
                assert(err instanceof Error);
                done();
            });
        });

        it('is rejected when rejected', () => {
            const promise = Promise.reject('rejected promise');
            return expect(promise).to(beRejected());
        });

        it('is eventually equal when resolved with equal content', () => {
            const promise = Promise.resolve('promise');
            return expect(promise).to(eventually(equal('promise')));
        });

        it('is not eventually equal when resolved with different content', () => {
            const promise = Promise.resolve('promise fail')
            return expect(promise).to(eventually(equal('promise')));
        });

        it('is not eventually equal when promise rejected, but have equal content', () => {
            const promise = Promise.reject('promise');
            return expect(promise).to(eventually(equal('promise')));
        });

    });

    it('handles own assertion', done => {
        const contain = assertion(({ actual, expected, not, stringify }) => {
            const arr = actual;
            const item = expected;
            const doesContain = arr.indexOf(item) > 0;

            if (not && doesContain) {
                return `Expected ${stringify(arr)} not to contain ${stringify(item)}`
            }
            if (!not && !doesContain) {
                return `Expected ${stringify(arr)} to contain ${stringify(item)}`
            }
        });

        expect([1,2,3]).to(contain(2));
        expect([1,2,3]).to(not(contain(4)));

        // We expect these to throw
        try {
            expect([1,2,3]).to(contain(4));
            assert.ok(false);
        } catch(e) {
            assert.equal(e.message, "Expected [\n  1\n  2\n  3\n] to contain 4");
        }
        try {
            expect([1,2,3]).to(not(contain(2)));
            assert.ok(false);
        } catch(e) {
            assert.equal(e.message, "Expected [\n  1\n  2\n  3\n] not to contain 2");
        }

        done();
    });

});

