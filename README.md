# node-restful-utils

[![Build Status](https://travis-ci.org/rockyliyanlok/node-restful-utils.svg?branch=master)](https://travis-ci.org/rockyliyanlok/node-restful-utils) [![Download Stats](https://img.shields.io/npm/dw/restful-utils.svg)](https://github.com/rockyliyanlok/node-restful-utils)

An utility class to validate RESTful api parameters, generate and handle errors in web service.

## Installation

To install the random generator, use [npm](http://github.com/npm/npm):

```
npm install --save restful-utils
```

## Usage

```javascript

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Restful = require('restful-utils');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/bad-request', (req, res, next) => {
  next(new Restful.BadRequestError());
})

app.get('/customized-messages', (req, res, next) => {
  next(new Restful.BadRequestError([
    { 
      location: 'query', 
      param: 'uid', 
      value: undefined, 
      msg: 'The uid field is required.' 
    }, 
    { 
      location: 'body', 
      param: 'name', 
      value: 'A', 
      msg: 'The name field must be between 2 and 255 characters in length.' 
    }
  ]));
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

app.post(['/update-validation', '/update-validation/:uid'], async (req, res, next) => {
  Restful.updateValidation(req)
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.delete(['/delete-validation', '/delete-validation/:uid'], async (req, res, next) => {
  Restful.deleteValidation(req)
  const errors = check.validationResult()
  if (!errors.isEmpty()) return next(new Restful.BadRequestError(errors.array()))
  res.status(HttpStatus.OK).json({ code: HttpStatus.OK })
})

app.use(RestfulErrors.handler());

const server = http.createServer(app);
server.listen(3000);

module.exports = server;

```

## API

## Tests

```
npm install
npm run test
```

## LICENSE

node-resful-utils is licensed under the MIT license.
