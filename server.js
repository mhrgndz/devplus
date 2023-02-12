'use strict';

import * as dotenv from 'dotenv';
import express from 'express';
import ErrorCodes from './src/objects/ErrorCodes.js';
import ResponseCodes from './src/objects/ResponseCodes.js';
import ResponseObject from './src/objects/ResponseObject.js';
import RequestHandler from './src/RequestHandler.js';
import ValidateRequest from './src/middleware/ValidateRequest.js';

const app = express();
const validate = new ValidateRequest();

app.use(express.json());
dotenv.config();

app.post('/api/*', async (req, res, next) => {
    const validateResult = await validate.validateRequest(req);
    if (validateResult){
        next('route');
    } 
    else{
        next();
    } 
  }, (req, res) => {
    res.send(new ResponseObject({}, ResponseCodes.ERROR, ErrorCodes.INVALID_USER));
});
  
app.post('/api/*', async (req, res) => {
    const reqHandler = new RequestHandler(req);
    res.send(await reqHandler.dispatch());
});

app.listen(process.env.PORT);