require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

//Include passport configuration
require("./configs/passport");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

//allows heroku to recieve connection from other websites
app.set("trust proxy", 1);

//Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    sameSite: 'none', // set to 'none' when deploying true
    secure: true, // set to true when deploying
    httpOnly: false, //set to false when deploying
    maxAge: 60000000 // ms = 1min
  },
  rolling: true,
  })
);

//Initialize passport
app.use(passport.initialize());
//Connect passport to the session
app.use(passport.session());
// default value for title local
app.locals.title = "Final Project - Web App";
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_HOSTNAME],
  })
);

// 

const index = require('./routes/index');
app.use('/', index);

// const contacts = require('./routes/contacts');
// app.use('/api', contacts);

const auth = require('./routes/auth');
app.use('/api', auth);

const cities = require('./routes/cities');
app.use('/api', cities);

const contacts = require('./routes/contacts');
app.use('/api', contacts);

module.exports = app;


//app.use(require('node-sass-middleware')({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

