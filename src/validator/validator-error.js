'use strict'

const _ = require('lodash')

class ValidatorError {

  constructor (errors) {
    this.errors = errors || []
  }

  reset () { 
    this.errors = [] 
  }

  push (error) { 
    if (!_.isNil(error)) {
      this.errors.push(error) 
    }
  }

  isEmpty () { 
    return _.isEmpty(this.errors)
  }

  array () { 
    return this.errors 
  }

  clone () { 
    return new ValidatorError(this.errors) 
  }

}

module.exports = ValidatorError
