/*** PROMISE ASSERTIONS ***/

function eventually(test) {
    return promise => promise.then(test,
        () => ({
            msg: 'Expected to eventually resolve, but was rejected'
        })
    );
}

function beFulfilled() {
    return actual => actual.then(
        () => undefined,
        () => {
            return {
                msg: 'Expected promise to be fulfilled'
            };
        }
    );
}

function beRejected() {
    return actual => actual.then(
        () => {
            return {
                msg: 'Expected promise to be rejected'
            };
        },
        () => undefined
    );
}

function beRejectedWith(test) {
}

module.exports = { eventually, beFulfilled, beRejected, beRejectedWith };
