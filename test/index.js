'use strict'

const decamelize = require('decamelize')
const HttpStatus = require('http-status-codes')
const chai = require('chai')
const expect = chai.expect
const app = require('./app')
chai.use(require('chai-http'))
chai.use(require('chai-string'))

const random = require('@rockyli/random')

const Restful = require('../src')

const getGeneralError = code => { 
  return decamelize(HttpStatus.getStatusText(code).replace(/\s/g, ''))
}

const getGeneralErrorDescription = code => {
  return `${HttpStatus.getStatusText(code)}.`
}

const checkGeneralError = async (response, code, checkDescription = true) => {
  const { body } = response
  expect(response).to.have.status(code)
  expect(body).to.have.property('code')
  expect(body).to.have.property('error')
  expect(body).to.have.property('error_description')
  expect(body.code).to.equal(code)
  expect(body.error).to.equal(getGeneralError(code))
  if (checkDescription) {
    expect(body.error_description).to.equal(getGeneralErrorDescription(code))
  }
}

describe('general restful errors', () => {

  it(`should returns general BadRequestError`, async () => {
    await checkGeneralError(await chai.request(app).get('/bad-request'), HttpStatus.BAD_REQUEST)
  })

  it(`should returns general UnauthorizedError`, async () => {
    await checkGeneralError(await chai.request(app).get('/unauthorized'), HttpStatus.UNAUTHORIZED)
  })

  it(`should returns general ForbiddenError`, async () => {
    await checkGeneralError(await chai.request(app).get('/forbidden'), HttpStatus.FORBIDDEN)
  })

  it(`should returns general NotFoundError`, async () => {
    await checkGeneralError(await chai.request(app).get('/not-found'), HttpStatus.NOT_FOUND)
  })

  it(`should returns general MethodNotAllowedError`, async () => {
    await checkGeneralError(await chai.request(app).get('/method-not-allowed'), HttpStatus.METHOD_NOT_ALLOWED)
  })

  it(`should returns general ConflictError`, async () => {
    await checkGeneralError(await chai.request(app).get('/conflict'), HttpStatus.CONFLICT)
  })

  it(`should returns general GoneError`, async () => {
    await checkGeneralError(await chai.request(app).get('/gone'), HttpStatus.GONE)
  })

  it(`should returns general RequestEntityTooLargeError`, async () => {
    await checkGeneralError(await chai.request(app).get('/request-entity-too-large'), HttpStatus.REQUEST_TOO_LONG)
  })

  it(`should returns general UnsupportedMediaTypeError`, async () => {
    await checkGeneralError(await chai.request(app).get('/unsupported-media-type'), HttpStatus.UNSUPPORTED_MEDIA_TYPE)
  })

  it(`should returns general UnprocessableEntityError`, async () => {
    await checkGeneralError(await chai.request(app).get('/unprocessable-entity'), HttpStatus.UNPROCESSABLE_ENTITY)
  })

  it(`should returns general TooManyRequestsError`, async () => {
    await checkGeneralError(await chai.request(app).get('/too-many-requests'), HttpStatus.TOO_MANY_REQUESTS)
  })

  it(`should returns general InternalServerError`, async () => {
    await checkGeneralError(await chai.request(app).get('/internal-server'), HttpStatus.INTERNAL_SERVER_ERROR)
  })

  it(`should returns general ServiceUnavailableError`, async () => {
    await checkGeneralError(await chai.request(app).get('/service-unavailable'), HttpStatus.SERVICE_UNAVAILABLE)
  })

})

describe('restful error with customized message', () => {

  it(`should returns general ForbiddenError with customized string message`, async () => {
    const response = await chai.request(app).get('/no-permission')
    const { body } = response
    const code = HttpStatus.FORBIDDEN
    expect(response).to.have.status(code)
    expect(body).to.have.property('code')
    expect(body).to.have.property('error')
    expect(body).to.have.property('error_description')
    expect(body.code).to.equal(code)
    expect(body.error).to.equal(getGeneralError(code))
    expect(body.error_description).to.equal('No permission.')
  })

  it(`should returns general BadRequestError with customized messages`, async () => {
    const response = await chai.request(app).get('/customized-messages')
    const { body } = response
    const code = HttpStatus.BAD_REQUEST
    expect(response).to.have.status(code)
    expect(body).to.have.property('code')
    expect(body).to.have.property('error')
    expect(body).to.have.property('error_description')
    expect(body.code).to.equal(code)
    expect(body.error).to.equal(getGeneralError(code))
    expect(body.error_description).to.equal([
      Restful.errorMessage.exists('uid'), 
      Restful.errorMessage.isLength('name', { min: 2, max: 255 })
    ].join(' '))
  })

})

describe('restful validator', () => {

  it(`should returns BadRequestError with single validator exists error`, async () => {
    const response = await chai.request(app)
      .post('/validator/')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({})
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.exists('uid'))
  })

  it(`should returns BadRequestError with single validator equals error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ name: 'John' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.equals('name', 'John Doe'))
  })

  it(`should returns BadRequestError with single validator isAfter error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ after: random.date(new Date(0), new Date()) })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.startsWith(Restful.errorMessage.isAfter('after').split('after ')[0])
  })

  it(`should returns BadRequestError with single validator isAlpha error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ alpha: '12345678' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.isAlpha('alpha'))
  })

  it(`should returns BadRequestError with single validator isAlphanumeric error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ alphanumeric: '!@#$%^&*' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.isAlphanumeric('alphanumeric'))
  })

  it(`should returns BadRequestError with single validator isBase64 error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ base64: '!@#$%^&*' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.isBase64('base64'))
  })

  it(`should returns BadRequestError with single validator isBefore error`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ before: random.date(new Date()) })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.startsWith(Restful.errorMessage.isBefore('before').split('before ')[0])
  })

  it(`should returns BadRequestError with multiple validator errors`, async () => {
    const response = await chai.request(app)
      .post(`/validator/${random.uuid()}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ boolean: 'not a boolean', email: 'not an email', float: 'not a float' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal([
      Restful.errorMessage.isBoolean('boolean'), 
      Restful.errorMessage.isEmail('email'), 
      Restful.errorMessage.isFloat('float')
    ].join(' '))
  })

})

describe('retrieve validation', () => {

  it(`should returns BadRequestError with before & after isInt() error`, async () => {
    const response = await chai.request(app)
      .get('/retrieve-validation')
      .query({ before: 'abcde', after: 'abcde' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal([
      Restful.errorMessage.isInt('before'), 
      Restful.errorMessage.isInt('after')
    ].join(' '))
  })

  it(`should returns BadRequestError with limit & offset isInt() error`, async () => {
    const response = await chai.request(app)
      .get('/retrieve-validation')
      .query({ limit: 'abcde', offset: 'abcde' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal([
      Restful.errorMessage.isInt('limit'), 
      Restful.errorMessage.isInt('offset')
    ].join(' '))
  })

  it(`should returns BadRequestError with before & after isInt() error (middleware)`, async () => {
    const response = await chai.request(app)
      .get('/retrieve-validation-middleware')
      .query({ before: 'abcde', after: 'abcde' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal([
      Restful.errorMessage.isInt('before'), 
      Restful.errorMessage.isInt('after')
    ].join(' '))
  })

  it(`should returns BadRequestError with limit & offset isInt() error (middleware)`, async () => {
    const response = await chai.request(app)
      .get('/retrieve-validation-middleware')
      .query({ limit: 'abcde', offset: 'abcde' })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal([
      Restful.errorMessage.isInt('limit'), 
      Restful.errorMessage.isInt('offset')
    ].join(' '))
  })

})

describe('update validation', () => {

  it(`should returns BadRequestError with uid exists() error`, async () => {
    const response = await chai.request(app)
      .post('/update-validation')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.exists('uid'))
  })

  it(`should returns BadRequestError with uid exists() error (middleware)`, async () => {
    const response = await chai.request(app)
      .post('/update-validation-middleware')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.exists('uid'))
  })

})

describe('delete validation', () => {

  it(`should returns BadRequestError with uid exists() error`, async () => {
    const response = await chai.request(app)
      .delete('/delete-validation')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.exists('uid'))
  })

  it(`should returns BadRequestError with uid exists() error (middleware)`, async () => {
    const response = await chai.request(app)
      .delete('/delete-validation-middleware')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ })
    checkGeneralError(response, HttpStatus.BAD_REQUEST, false)
    expect(response.body.error_description).to.equal(Restful.errorMessage.exists('uid'))
  })

})
