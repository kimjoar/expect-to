import assert from 'assert';
import Promise from 'bluebird';
import expect from './';
import { not, equal } from './assertions';

describe('expected', () => {

    describe('equal', () => {
        it('succeeds when strings are equal', () => {
            expect('test').to(equal('test'));
        });

        it('fails when strings are not equal', () => {
            assert.throws(() => {
                expect('test').to(equal('testing'));
            });
        });

        it('with not succeeds when strings are not equal', () => {
            expect('test').to(not(equal('testing')));
        });

        it('with not fails when strings are equal', () => {
            assert.throws(() => {
                expect('test').to(not(equal('test')));
            });
        });

        it('succeeds when booleans are equal', () => {
            expect(true).to(equal(true));
        });

        it('fails when booleans are not equal', () => {
            assert.throws(() => {
                expect(true).to(equal(false));
            });
        });

        it('succeeds when same reference', () => {
            const test = { name: 'kim' };
            expect(test).to(equal(test));
        });

        it('fails when different references', () => {
            const ref1 = { name: 'kim' };
            const ref2 = { name: 'kim' };

            assert.throws(() => {
                expect(ref1).to(equal(ref2));
            });
        });
    });


});

