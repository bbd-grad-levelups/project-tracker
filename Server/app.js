const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// const oauthMiddleware = require('./Middleware/OAuth');
// app.use(oauthMiddleware);

// const registrationMiddleware = require('./Middleware/RegisterUser');
// app.use(registrationMiddleware);

const testRouter = require('./routes/test');
app.use('/test', testRouter);

module.exports = app;
