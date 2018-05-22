'use strict'

const arrayPad = require('array-pad')
const arrify = require('arrify')
const entries = require('entries-iterator')
const isNumber = require('@lamansky/is-number')
const isPlainObject = require('is-plain-object')
const jfn = require('jfn')
const plainify = require('plainify')
const qfn = require('qfn')
const supportBindOperator = require('sbo')
const unarray = require('unarray')
const wfn = require('wfn')

module.exports = function xfn ({pluralArg = 0, pluralFirst, pluralProp, pluralReturn, optionArg, optionProps, sbo}, fn) {
  const ignoreThis = []

  let maybeSbo = f => f
  if (sbo !== false) {
    sbo = plainify('arg', sbo)
    maybeSbo = f => supportBindOperator({...sbo, ignoreThis}, f)
  }

  const maybeUnarray = qfn(unarray, pluralReturn)

  const arrifyArg = args => editArg(args, pluralArg, a => arrify(a))
  const optionize = (args, options) => editArg(args, optionArg, (a = {}) => ({...a, ...options}))
  const addArg = (args, value) => { args.splice(optionArg, 0, value); return args }
  const pluralize = args => editArg(args, pluralArg, a => [a])

  function wrapFn (argFilters = [], returnFilters = [], options) {
    argFilters = jfn(argFilters)
    returnFilters = jfn(returnFilters)
    return maybeSbo(wfn(fn, (...args) => returnFilters(fn(...argFilters(args, options)))))
  }

  let root
  if (pluralProp) {
    if (!isNumber(pluralArg)) throw new TypeError('pluralArg must be a number')
    ignoreThis.push(root = wrapFn([pluralize], [maybeUnarray]))
    ignoreThis.push(root[pluralProp] = wrapFn([arrifyArg]))
  } else {
    ignoreThis.push(root = maybeSbo(fn))
  }

  if (optionProps) {
    if (!isNumber(optionArg)) throw new TypeError('optionArg must be a number')
    if (pluralProp && pluralArg === optionArg) throw new RangeError('pluralArg cannot be the same as optionArg')
    for (const [prop, options] of entries(optionProps)) {
      if (pluralProp) {
        ignoreThis.push(root[prop] = wrapFn([pluralize, optionize], [maybeUnarray], options))
        ignoreThis.push(root[pluralFirst ? pluralProp : prop][pluralFirst ? prop : pluralProp] = wrapFn([arrifyArg, isPlainObject(options) ? optionize : addArg], [], options))
      } else {
        root[prop] = wrapFn([optionize], [], options)
      }
    }
  }

  return root
}

function editArg (args, index, cb) {
  args = arrayPad(args, index)
  args[index] = cb(args[index])
  return args
}
