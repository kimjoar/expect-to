import assert from 'assert';
import expect from './';
import { not, equal, beTrue, beFalse, beTruthy, beFalsy, beUndefined, beNull, exist, beEmpty, contain, beInstanceOf, match } from './assertions';

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

  describe('beTrue', () => {
    it('succeeds when true', () => {
      expect(true).to(beTrue);
    });

    it('fails when false', () => {
      assert.throws(() => {
        expect(false).to(beTrue);
      });
    });
  });

  describe('beFalse', () => {
    it('succeeds when false', () => {
      expect(false).to(beFalse);
    });

    it('fails when true', () => {
      assert.throws(() => {
        expect(true).to(beFalse);
      });
    });
  });

  describe('beTruthy', () => {
    it('succeeds when true', () => {
      expect(true).to(beTruthy);
    });

    it('succeeds when non-empty string', () => {
      expect('test').to(beTruthy);
    });

    it('fails when false', () => {
      assert.throws(() => {
        expect(false).to(beTruthy);
      });
    });

    it('fails when empty string', () => {
      assert.throws(() => {
        expect('').to(beTruthy);
      });
    });
  });

  describe('beFalse', () => {
    it('succeeds when false', () => {
      expect(false).to(beFalsy);
    });

    it('succeeds when empty string', () => {
      expect('').to(beFalsy);
    });

    it('succeeds when null', () => {
      expect(null).to(beFalsy);
    });

    it('succeeds when undefined', () => {
      expect(undefined).to(beFalsy);
    });

    it('succeeds when number 0', () => {
      expect(0).to(beFalsy);
    });

    it('fails when true', () => {
      assert.throws(() => {
        expect(true).to(beFalsy);
      });
    });

    it('fails when non-empty string', () => {
      assert.throws(() => {
        expect('test').to(beFalsy);
      });
    });
  });

  describe('beUndefined', () => {
    it('succeeds when undefined', () => {
      expect(undefined).to(beUndefined);
    });

    it('fails when null', () => {
      assert.throws(() => {
        expect(null).to(beUndefined);
      });
    });

    it('fails when string', () => {
      assert.throws(() => {
        expect('').to(beUndefined);
      });
    });
  });

  describe('beNull', () => {
    it('succeeds when null', () => {
      expect(null).to(beNull);
    });

    it('fails when undefined', () => {
      assert.throws(() => {
        expect(undefined).to(beNull);
      });
    });

    it('fails when string', () => {
      assert.throws(() => {
        expect('').to(beNull);
      });
    });
  });

  describe('exist', () => {
    it('succeeds when string', () => {
      expect('test').to(exist);
    });

    it('fails when undefined', () => {
      assert.throws(() => {
        expect(undefined).to(exist);
      });
    });

    it('fails when null', () => {
      assert.throws(() => {
        expect(null).to(exist);
      });
    });
  });

  describe('beEmpty', () => {
    it('succeeds when array is empty', () => {
      expect([]).to(beEmpty);
    });

    it('fails when array contains any items', () => {
      assert.throws(() => {
        expect([1]).to(beEmpty);
      });
    });
  });

  describe('contain', () => {
    it('succeeds when array contains item', () => {
      expect([1,2,3]).to(contain(1));
    });

    it('fails when array does not contain item', () => {
      assert.throws(() => {
        expect([1,2,3]).to(contain(4));
      });
    });
  });

  describe('beInstanceOf', () => {
    it('succeeds for dates', () => {
      expect(new Date()).to(beInstanceOf(Date));
    });

    it('succeeds for objects', () => {
      expect({}).to(beInstanceOf(Object));
    });

    it('succeeds for constructor functions', () => {
      function C(){}
      var o = new C();

      expect(o).to(beInstanceOf(C));
    });

    it('fails when type does not match', () => {
      assert.throws(() => {
        expect(new Date()).to(beInstanceOf(String));
      });
    });

    it('fails when different constructor function', () => {
      function C(){}
      function D(){}
      var o = new C();

      assert.throws(() => {
        expect(o).to(beInstanceOf(D));
      });
    });
  });

  describe('match', () => {
    it('succeeds when strings match', () => {
      expect('Hello').to(match(/hello/i));
    });

    it('fails when strings does not match', () => {
      assert.throws(() => {
        expect('hola').to(match(/hello/));
      });
    });
  });

});
