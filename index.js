import isPromise from 'is-promise';
import stringify from './stringify';

function assert(result, msg, err, expected) {
    if (result === true) return;
    return { msg, expected };
}

assert.not = function assertNot(result, msg, err, expected) {
    if (result === false) return;
    return { msg: err, expected };
}

function expect(actual) {
    return {
        to: test => {
            const res = test({ actual, assert, stringify });

            if (isPromise(res)) {
                return res.then(
                    throwIfError,
                    throwIfError
                );
            }
            else {
                throwIfError(res);
            }
        }
    }
}

function throwIfError(res) {
    if (res !== undefined) {
        const err = new Error(res.msg);
        err.expected = res.expected;
        err.actual = res.actual;
        err.showDiff = true;
        throw err;
    }
}

export default expect;
