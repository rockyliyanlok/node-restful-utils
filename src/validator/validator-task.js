'use strict'

const _ = require('lodash')

class ValidatorTask {
  
  constructor (options) {
    this.set(options)
  }

  reset () {
    this.location = undefined
    this.param = undefined
    this.value = undefined
    this.msg = undefined
  }

  set (options) {
    options = options || {}
    this.reset()
    this.location = options.location || undefined
    this.param = options.param || undefined
    this.value = options.value || undefined
    this.msg = options.msg || undefined
  }

  error () {
    return !_.isNil(this.msg) ? { 
      location: this.location, 
      param: this.param, 
      value: this.value, 
      msg: this.msg
    } : null
  }

}

module.exports = ValidatorTask
