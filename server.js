'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Separated Routes for each Resource
const usersRoutes = require('./routes/users');
const voteRoutes = require('./routes/vote');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output coloured by response status for development use.
//         The :status token will be coloured red for server error codes, yellow for client error codes, cyan for redirection codes, and uncoloured for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));

// Mount all resource routes:

// show list of users
// TODO: delete user list; it's for demo purpose only
app.use('/api/users', usersRoutes(knex));

app.use('/vote', voteRoutes(knex));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// 

// catch any other page as error
app.get(/.*/, (req, res) => {
  res.render('error');
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
