# Extended Function (xfn)

Extends a function object with configured versions of itself.

## Installation

Requires [Node.js](https://nodejs.org/) 7.0.0 or above.

```bash
npm i xfn
```

## Tutorial

### Singular/Plural

`xfn` simplifies the process of creating singular and plural versions of the same function (e.g. `get()` and `get.all()`). The function that you write is the plural version, and `xfn` creates the singular version. The following example uses `each` as the name of the plural function:

```javascript
const xfn = require('xfn')

const getFirstOf = xfn({
  pluralProp: 'each',
  pluralReturn: true,
}, arrs => arrs.map(arr => arr[0]))

const arr = [[1, 2], ['a', 'b']]

getFirstOf(arr) // [1, 2]
getFirstOf.each(arr) // [[1], ['a']]
```

The first call treats `arr` as a single array, while the second call treats `arr` as an array of arrays.

### Preset Options

`xfn` lets you create subfunctions that have certain options preconfigured. For example, you can replace `fn(arg, {option: true})` with `fn.option(arg)`.

```javascript
const getOwnProperty = require('get-own-property')
const xfn = require('xfn')

const get = xfn({
  optionArg: 2, // The index of the parameter that contains the options
  optionProps: {own: {own: true}},
}, (obj, key, {own} = {}) => own ? getOwnProperty(obj, key) : obj[key])

class Cls {
  get inherited () { return 123 }
}

const obj = new Cls()
obj.mine = 456

get(obj, 'mine') // 456
get(obj, 'inherited') // 123
get.own(obj, 'mine') // 456
get.own(obj, 'inherited') // undefined
```

## API

The module exports a single function.

### Parameters

1. Object argument:
    * Optional: `pluralArg` (positive integer): The zero-based index of the argument that should be singularized if `pluralProp` is set. Defaults to `0`.
    * Optional: `pluralFirst` (boolean): If `true`, the `pluralProp` comes before the `optionProps` when they are both set. Defaults to `false`. (For example: a `pluralProp` of `all` and an `optionProps` key of `in` will result in a property chain of `all.in()` if `true`, or `in.all()` if `false`.)
    * Optional: `pluralProp` (string or symbol): If set, the returned function will be a singularized version of `fn`, and the original `fn` will be attached to the `pluralProp` property of the returned function (e.g. if `pluralProp` is set to `'all'` and the returned function is assigned to the variable `get`, the available functions will be `get()` and `get.all()`).
    * Optional: `pluralReturn` (boolean): Only applies if `pluralProp` is set. Set to `true` if `fn` returns an array of one result per argument. (This will cause the one-element result array to be unwrapped when the singularized function is called.) Set to `false` if `fn` returns a result that does not correspond to the number of arguments. Defaults to `false`.
    * Required if `optionProps` is set: `optionArg` (positive integer): The zero-based index of the argument into which the preconfigured options of `optionProps` should be inserted.
    * Optional: `optionProps` (object or Map): A collection whose keys are the desired `fn` property keys and whose values are the option objects that should be merged into the plain object argument at index `optionArg`.
    * Optional: `sbo` (object or false): Options to be passed to the [`sbo`](https://github.com/lamansky/sbo) module (which adds support for the bind operator), or `false` if you do not want the `sbo` module applied.
2. `fn` (function): The main function that should be extended on the basis of the arguments in the first parameter.

### Return Value

A function object with `pluralProp` and/or `optionProps` properties.

## Related

This module is part of the `fn` family of modules.

* [efn](https://github.com/lamansky/efn): Extracted Function
* [ffn](https://github.com/lamansky/ffn): Filtering Function
* [jfn](https://github.com/lamansky/jfn): Joined Function
* [mfn](https://github.com/lamansky/mfn): Memoized Function
* [ofn](https://github.com/lamansky/ofn): Overloaded Function
* [pfn](https://github.com/lamansky/pfn): Possible Function
* [qfn](https://github.com/lamansky/qfn): Qualified Function
* [vfn](https://github.com/lamansky/vfn): Variadic Function
* [wfn](https://github.com/lamansky/wfn): Wrapper Function
