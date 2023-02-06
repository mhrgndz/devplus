'use strict';

import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import ErrorCodes from './src/objects/ErrorCodes.js';
import ResponseCodes from './src/objects/ResponseCodes.js';
import ResponseObject from './src/objects/ResponseObject.js';
import RequestHandler from './src/RequestHandler.js';
import Authentication from './src/middleware/Authentication.js';

const app = express();
const Auth = new Authentication();

app.get('/api/*', async (req, res, next) => {
    const verifyResult = await Auth.verifyToken(req.headers['accesstoken'], req.path);
    if (verifyResult){
        next('route');
    } 
    else{
        next();
    } 
  }, (req, res, next) => {
    res.send(new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.INVALID_USER));
});
  
app.get('/api/*', (req, res, next) => {
    const test = new RequestHandler();
    test.dispatch();
    res.send(new ResponseObject({}));
});

app.listen(process.env.PORT);