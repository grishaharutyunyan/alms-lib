const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const db = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotEnv = require('dotenv');
const passport = require('passport');

const PORT = process.env.PORT 
const app = express();

// Passport config
require('./config/passport')(passport);
dotEnv.config();
db();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error')
  next();
});

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);



app.get('/', (req, res) => {
  res.render('layouts/main', { title: 'Home page' });
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/images/icons8-library-16.png'));
});

app.use(express.static(path.join(__dirname, 'public')));



//bookk

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
