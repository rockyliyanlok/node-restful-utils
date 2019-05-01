'use strict'

const check = require('../validator')
const error = require('../error')

const findAllValidation = (req, res, next) => {
  check.query(req, 'before').isInt()
    check.query(req, 'after').isInt()
    check.query(req, 'limit').isInt()
    check.query(req, 'offset').isInt()
    const errors = check.validationResult()
    return errors.isEmpty() ? next() : next(new error.BadRequestError(errors.array()))
}

const findOneValidation = (req, res, next) => {
  check.params(req, 'uid').exists().isUUID()
  const errors = check.validationResult()
  return errors.isEmpty() ? next() : next(new error.BadRequestError(errors.array()))
}

const updateValidation = (req, res, next) => {
  check.params(req, 'uid').exists().isUUID()
  const errors = check.validationResult()
  return errors.isEmpty() ? next() : next(new error.BadRequestError(errors.array()))
}

const deleteValidation = (req, res, next) => {
  check.params(req, 'uid').exists().isUUID()
  const errors = check.validationResult()
  return errors.isEmpty() ? next() : next(new error.BadRequestError(errors.array()))
}

module.exports = {
  findAllValidation, 
  findOneValidation, 
  updateValidation, 
  deleteValidation
}