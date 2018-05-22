'use strict'

const assert = require('assert')
const equals = require('equals')
const xfn = require('.')

describe('xfn()', function () {
  it('should make the function support the bind operator', function () {
    const obj = {}
    let arg0
    xfn({}, a => { arg0 = a }).call(obj)
    assert.strictEqual(arg0, obj)
  })

  it('should support the `sbo` parameter', function () {
    const obj = {}
    let arg0
    xfn({sbo: 1}, (x, a) => { arg0 = a }).call(obj)
    assert.strictEqual(arg0, obj)
  })

  it('should arrify singular root argument when `pluralProp` is set', function () {
    let arg0
    const f = xfn({pluralProp: 'all'}, a => { arg0 = a; return a })
    assert.strictEqual(typeof f, 'function')
    assert.strictEqual(typeof f.all, 'function')
    assert(equals(f('test'), ['test']))
    assert(equals(arg0, ['test']))
    assert(equals(f.all(['test']), ['test']))
    assert(equals(arg0, ['test']))
  })

  it('should unarray plural return when `pluralReturn` is set', function () {
    let arg0
    const f = xfn({pluralProp: 'all', pluralReturn: true}, a => { arg0 = a; return a })
    assert.strictEqual(typeof f, 'function')
    assert.strictEqual(typeof f.all, 'function')
    assert.strictEqual(f('test'), 'test')
    assert(equals(arg0, ['test']))
    assert(equals(f.all(['test']), ['test']))
    assert(equals(arg0, ['test']))
  })

  it('should arrify pluralArg for plural', function () {
    let arg0
    const f = xfn({pluralProp: 'all'}, a => { arg0 = a; return a })
    assert(equals(f.all('test'), ['test']))
    assert(equals(arg0, ['test']))
  })

  it('should use `optionProps` to create versions with options already set', function () {
    let options
    const f = xfn({
      optionArg: 1,
      optionProps: {
        test: {test: true},
      },
    }, (x, o) => {
      options = o
    })
    assert.strictEqual(typeof f, 'function')
    assert.strictEqual(typeof f.test, 'function')
    f.test(null)
    assert.strictEqual(options.test, true)
    f.test(null, {userOption: 123})
    assert.strictEqual(options.test, true)
    assert.strictEqual(options.userOption, 123)
  })

  it('shouldn’t let users override options from `optionProps`', function () {
    let options
    const f = xfn({
      optionArg: 0,
      optionProps: {
        test: {test: true},
      },
    }, o => {
      options = o
    })
    f.test({test: false, userOption: 123})
    assert.strictEqual(options.test, true)
    assert.strictEqual(options.userOption, 123)
  })

  it('should make preconfigured functions support the bind operator', function () {
    let _this
    const f = xfn({
      optionArg: 1,
      optionProps: {
        test: {test: true},
      },
    }, (x, o) => { _this = x })
    const obj = {}
    f.test()
    assert.strictEqual(typeof _this, 'undefined')
    f.test.call(obj)
    assert.strictEqual(_this, obj)
  })

  it('should be able to apply both `pluralProp` and `optionProp`', function () {
    let arg0, arg1
    const f = xfn({
      pluralProp: 'all',
      pluralReturn: true,
      optionArg: 1,
      optionProps: {
        test: {test: true},
      },
    }, (a, o) => {
      arg0 = a
      arg1 = o
      return a
    })
    assert.strictEqual(typeof f, 'function')
    assert.strictEqual(typeof f.all, 'function')
    assert.strictEqual(typeof f.test, 'function')
    assert.strictEqual(typeof f.test.all, 'function')
    assert.strictEqual(f.test('test'), 'test')
    assert(equals(arg0, ['test']))
    assert(equals(arg1, {test: true}))
    assert(equals(f.test.all(['test']), ['test']))
    assert(equals(arg0, ['test']))
    assert(equals(arg1, {test: true}))

    // Same as before, this time emulating the bind operator
    assert(equals(f.test.all.call(['test']), ['test']))
    assert(equals(arg0, ['test']))
    assert(equals(arg1, {test: true}))
  })

  it('should throw TypeError if `pluralArg` is not a number', function () {
    assert.throws(() => { xfn({pluralArg: 'str', pluralProp: 'all'}, () => {}) }, TypeError)
  })

  it('should throw TypeError if `optionArg` is not a number', function () {
    assert.throws(() => { xfn({optionArg: 'str', optionProps: {in: {in: true}}}, () => {}) }, TypeError)
  })

  it('should throw RangeError if `optionArg` equals `pluralArg`', function () {
    assert.throws(() => { xfn({optionArg: 0, optionProps: {in: {in: true}}, pluralArg: 0, pluralProp: 'all'}, () => {}) }, RangeError)
  })
})
