const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); 
const app = express(); 


const limiter = rateLimit({   windowMs: 5 * 60 * 1000, 
max: 100, 
message: 'Too many requests from this IP, please try again later.'}); 
app.use(limiter);

const secondLimiter = rateLimit({   windowMs: 1000, 
max: 15, 
message: 'Too many requests from this IP, please try again later.'}); 
app.use(secondLimiter);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

var router = express.Router();
router.get('/', function(req, res) {
  res.send("helth");
});
app.use(router);

app.use(bodyParser.json());

const oauthMiddleware = require('./Middleware/OAuth');
app.use(oauthMiddleware);

const registrationMiddleware = require('./Middleware/RegisterUser');
app.use(registrationMiddleware);

const userRouter = require('./routes/users.js');
app.use('/user', userRouter);

const projectRouter = require('./routes/project.js');
app.use('/project', projectRouter);

const boardRouter = require('./routes/board.js');
app.use('/board', boardRouter);

module.exports = app;