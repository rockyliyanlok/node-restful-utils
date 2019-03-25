'use strict'

const check = require('../validator')

const retrieveValidation = req => {
  check.query(req, 'before').isInt()
  check.query(req, 'after').isInt()
  check.query(req, 'limit').isInt()
  check.query(req, 'offset').isInt()
}

const updateValidation = req => {
  check.params(req, 'uid').exists()
}

const deleteValidation = req => {
  check.params(req, 'uid').exists()
}

module.exports = {
  retrieveValidation, 
  updateValidation, 
  deleteValidation
}