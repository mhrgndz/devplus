'use strict';

import * as dotenv from 'dotenv';
import express from 'express';
import ErrorCodes from './src/objects/ErrorCodes.js';
import ResponseCodes from './src/objects/ResponseCodes.js';
import ResponseObject from './src/objects/ResponseObject.js';
import RequestHandler from './src/RequestHandler.js';
import Authentication from './src/middleware/Authentication.js';

dotenv.config();
const app = express();
const Auth = new Authentication();

app.get('/api/*', async (req, res, next) => {
    const validateResult = await Auth.validateRequest(req);
    if (validateResult){
        next('route');
    } 
    else{
        next();
    } 
  }, (req, res, next) => {
    res.send(new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.INVALID_USER));
});
  
app.get('/api/*', async (req, res, next) => {
    const reqHandler = new RequestHandler(req);
    res.send(await reqHandler.dispatch());
});

app.listen(process.env.PORT);