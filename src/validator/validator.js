'use strict'

const _ = require('lodash')
const validator = require('validator')
const ValidatorError = require('./validator-error')
const ValidatorTask = require('./validator-task')
const message = require('../error/error-message')

class Validator {
  
  constructor () {

    this.error = new ValidatorError()
    this.task = new ValidatorTask()

    if(_.isNil(Validator.instance)) {
      Validator.instance = this
    }

    return Validator.instance
  }

  check (req, param) {
    if (!_.isNil(req.body[param])) { 
      return this.body(req, param) 
    } else if (!_.isNil(req.query[param])) { 
      return this.query(req, param) 
    } else if (!_.isNil(req.params[param])) { 
      return this.params(req, param) 
    } else { 
      this.error.push(this.task.error())
      return this 
    }
  }

  body (req, param) { 
    req.body = req.body || {}
    this.error.push(this.task.error())
    this.task.set({ 
      location: 'body', 
      param, 
      value: req.body[param] 
    })
    return this
  }

  query (req, param) { 
    req.query = req.query || {}
    this.error.push(this.task.error())
    this.task.set({ 
      location: 'query', 
      param, 
      value: req.query[param] 
    })  
    return this
  }

  params (req, param) { 
    req.params = req.params || {}
    this.error.push(this.task.error())
    this.task.set({ 
      location: 'params', 
      param, 
      value: req.params[param] 
    })  
    return this
  }

  _noParamValidator (func) {
    const { value, param } = this.task
    if (!_.isNil(value) && !validator[func](value)) {
      this.task.msg = message[func](param)
    }
    return this
  }

  _oneParamValidator (func, arg) {
    const { value, param } = this.task
    if (!_.isNil(value) && !validator[func](value, arg)) {
      this.task.msg = message[func](param, arg)
    }
    return this
  }

  _twoParamValidator (func, arg1, arg2) {
    const { value, param } = this.task
    if (!_.isNil(value) && !validator[func](value, arg1, arg2)) {
      this.task.msg = message[func](param, arg1)
    }
    return this
  }

  contains (seed) {
    return this._oneParamValidator('contains', seed)
  }

  equals (comparsion) {
    return this._oneParamValidator('equals', comparsion)
  }

  isAfter (date) {
    return this._oneParamValidator('isAfter', date)
  }

  isAlpha (locale) {
    return this._oneParamValidator('isAlpha', locale)
  }

  isAlphanumeric (locale) {
    return this._oneParamValidator('isAlphanumeric', locale)
  }

  isAscii () {
    return this._noParamValidator('isAscii')
  }

  isBase64 () {
    return this._noParamValidator('isBase64')
  }

  isBefore (date) {
    return this._oneParamValidator('isBefore', date)
  }

  isBoolean () {
    return this._noParamValidator('isBoolean')
  }

  isByteLength (options) {
    return this._oneParamValidator('isByteLength', options)
  }

  isCreditCard () {
    return this._noParamValidator('isCreditCard')
  }

  isCurrency (options) {
    return this._oneParamValidator('isCurrency', options)
  }

  isDataURI () {
    return this._noParamValidator('isDataURI')
  }

  isMagnetURI () {
    return this._noParamValidator('isMagnetURI')
  }

  isDecimal (options) {
    return this._oneParamValidator('isDecimal', options)
  }

  isDivisibleBy (number) {
    return this._oneParamValidator('isDivisibleBy', number)
  }

  isEmail (options) {
    return this._oneParamValidator('isEmail', options)
  }

  isEmpty (options) {
    return this._oneParamValidator('isEmpty', options)
  }

  isFQDN (options) {
    return this._oneParamValidator('isFQDN', options)
  }

  isFloat (options) {
    return this._oneParamValidator('isFloat', options)
  }

  isFullWidth () {
    return this._noParamValidator('isFullWidth')
  }

  isHalfWidth () {
    return this._noParamValidator('isHalfWidth')
  }

  isHash (algorithm) {
    return this._oneParamValidator('isHash', algorithm)
  }

  isHexColor () {
    return this._noParamValidator('isHexColor')
  }

  isHexadecimal () {
    return this._noParamValidator('isHexadecimal')
  }

  isIdentityCard (locale) {
    return this._noParamValidator('isIdentityCard', locale)
  }

  isIP (version) {
    return this._noParamValidator('isIP', version)
  }

  isIPRange () {
    return this._noParamValidator('isIPRange')
  }

  isISBN (version) {
    return this._oneParamValidator('isISBN', version)
  }

  isISSN (options) {
    return this._oneParamValidator('isISSN', options)
  }

  isISIN () {
    return this._noParamValidator('isISIN')
  }

  isISO8601 () {
    return this._noParamValidator('isISO8601')
  }

  isRFC3339 () {
    return this._noParamValidator('isRFC3339')
  }

  isISO31661Alpha2 () {
    return this._noParamValidator('isISO31661Alpha2')
  }

  isISO31661Alpha3 () {
    return this._noParamValidator('isISO31661Alpha3')
  }

  isISRC () {
    return this._noParamValidator('isISRC')
  }

  isIn (values) {
    return this._oneParamValidator('isIn', values)
  }

  isInt (options) {
    return this._oneParamValidator('isInt', options)
  }

  isJSON () {
    return this._noParamValidator('isJSON')
  }

  isJWT () {
    return this._noParamValidator('isJWT')
  }

  isLatLong () {
    return this._noParamValidator('isLatLong')
  }

  isLength (options) {
    return this._oneParamValidator('isLength', options)
  }

  isLowercase () {
    return this._noParamValidator('isLowercase')
  }

  isMACAddress () {
    return this._noParamValidator('isMACAddress')
  }

  isMD5 () {
    return this._noParamValidator('isMD5')
  }

  isMimeType () {
    return this._noParamValidator('isMimeType')
  }

  isMobilePhone (locale, options) {
    return this._twoParamValidator('isMobilePhone', locale, options)
  }

  isMongoId () {
    return this._noParamValidator('isMongoId')
  }

  isMultibyte () {
    return this._noParamValidator('isMultibyte')
  }

  isNumeric (options) {
    return this._oneParamValidator('isNumeric', options)
  }

  isPort () {
    return this._noParamValidator('isPort')
  }

  isPostalCode (locale) {
    return this._oneParamValidator('isPostalCode', locale)
  }

  isSurrogatePair () {
    return this._noParamValidator('isSurrogatePair')
  }

  isURL (options) {
    return this._oneParamValidator('isURL', options)
  }

  isUUID (version) {
    return this._oneParamValidator('isUUID', version)
  }

  isUppercase () {
    return this._noParamValidator('isUppercase')
  }

  isVariableWidth () {
    return this._noParamValidator('isVariableWidth')
  }

  isWhitelisted (chars) {
    return this._oneParamValidator('isWhitelisted', chars)
  }

  matches (pattern, modifiers) {
    return this._twoParamValidator('matches', pattern, modifiers)
  }

  exists () {
    const { value, param } = this.task
    if (_.isNil(value)) {
      this.task.msg = message.exists(param)
    }
    return this
  }
  
  custom (func) {
    if (!_.isNil(this.task.value) && !func(this.task.value)) {
      this.task.msg = message.invalid(this.task.param)
    }
    return this
  }

  withMessage (msg) {
    if(!_.isNil(this.task.msg)) {
      this.task.msg = msg
    }
    this.error.push(this.task.error())
    return this
  }

  reset () { 
    this.error.reset()
    this.task.reset()
  }

  validationResult () { 
    this.error.push(this.task.error())
    let error = this.error.clone()
    this.reset()
    return error 
  }

}

const instance = new Validator()

module.exports = instance
