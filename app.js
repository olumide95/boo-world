'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const bodyParser = require('body-parser');

const express = require('express');
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const app = express();

async function MongooseConnect() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    mongoose.connect(uri, function(err, con) {
        console.log("Success: ", con)
        console.log("Failure: ", err)
    });
}

mongoose.connection.on('error', (err) => {
    throw new Error(`unable to connect to database: ${err}`)
})


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/profiles', require('./routes/profile')());
app.use('/users', require('./routes/user')());

const server = app.listen(port, () => {
    console.log('Express started. Listening on %s', port);
    MongooseConnect()
});

module.exports = app;