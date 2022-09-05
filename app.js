'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/profiles', require('./routes/profile')());
app.use('/users', require('./routes/user')());
app.use('/comments', require('./routes/comment')());

module.exports = app;