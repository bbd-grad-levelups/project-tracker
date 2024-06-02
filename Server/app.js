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

const oauthMiddleware = require('./Middleware/OAuth');
app.use(oauthMiddleware);

const registrationMiddleware = require('./Middleware/RegisterUser');
app.use(registrationMiddleware);

const healthRouter = require('./routes/health.js');
app.use('/', healthRouter);

const userRouter = require('./routes/users.js');
app.use('/user', userRouter);

const projectRouter = require('./routes/project.js');
app.use('/project', projectRouter);

const boardRouter = require('./routes/board.js');
app.use('/board', boardRouter);

module.exports = app;