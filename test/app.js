'use strict'

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const HttpStatus = require('http-status-codes')
const Restful = require('../src')
const { findAllValidation, updateValidation, deleteValidation } = Restful.middleware
const check = Restful.validator

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/bad-request', (req, res, next) => {
  next(new Restful.BadRequestError())
})

app.get('/unauthorized', (req, res, next) => {
  next(new Restful.UnauthorizedError())
})

app.get('/forbidden', (req, res, next) => {
  next(new Restful.ForbiddenError())
})

app.get('/not-found', (req, res, next) => {
  next(new Restful.NotFoundError())
})

app.get('/method-not-allowed', (req, res, next) => {
  next(new Restful.MethodNotAllowedError())
})

app.get('/conflict', (req, res, next) => {
  next(new Restful.ConflictError())
})

app.get('/gone', (req, res, next) => {
  next(new Restful.GoneError())
})

app.get('/request-entity-too-large', (req, res, next) => {
  next(new Restful.RequestEntityTooLargeError())
})

app.get('/unsupported-media-type', (req, res, next) => {
  next(new Restful.UnsupportedMediaTypeError())
})

app.get('/unprocessable-entity', (req, res, next) => {
  next(new Restful.UnprocessableEntityError())
})

app.get('/too-many-requests', (req, res, next) => {
  next(new Restful.TooManyRequestsError())
})

app.get('/internal-server', (req, res, next) => {
  next(new Restful.InternalServerError())
})

app.get('/service-unavailable', (req, res, next) => {
  next(new Restful.ServiceUnavailableError())
})

app.get('/no-permission', (req, res, next) => {
  next(new Restful.ForbiddenError('No permission.'))
})

app.get('/customized-messages', (req, res, next) => {
  next(new Restful.BadRequestError([
    { location: 'query', param: 'uid', value: undefined, msg: Restful.errorMessage.exists('uid') }, 
    { location: 'body', param: 'name', value: undefined, msg: Restful.errorMessage.isLength('name', { min: 2, max: 255 }) }
  ]))
})

app.post(['/validator', '/validator/:uid'], async (req, res, next) => {
  check.params(req, 'uid').exists()
  check.body(req, 'name').equals('John Doe')
  check.body(req, 'after').isAfter()
  check.body(req, 'alpha').isAlpha()
  check.body(req, 'alphanumeric').isAlphanumeric()
  check.body(req, 'base64').isBase64()
  check.body(req, 'before').isBefore()
  check.body(req, 'boolean').isBoolean()
  check.body(req, 'email').isEmail()
  check.body(req, 'float').isFloat()
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.get('/retrieve-validation', async (req, res, next) => {
  Restful.retrieveValidation(req)
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.get('/retrieve-validation-middleware', findAllValidation, async (req, res, next) => {
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.post(['/update-validation', '/update-validation/:uid'], async (req, res, next) => {
  Restful.updateValidation(req)
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.post(['/update-validation-middleware', '/update-validation-middleware/:uid'], updateValidation,  async (req, res, next) => {
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.delete(['/delete-validation', '/delete-validation/:uid'], async (req, res, next) => {
  Restful.deleteValidation(req)
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.delete(['/delete-validation-middleware', '/delete-validation-middleware/:uid'], deleteValidation, async (req, res, next) => {
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.use(Restful.errorHandler())

const server = http.createServer(app)
server.listen(3000)

module.exports = server

