const app = require('./app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log('Express started. Listening on %s', port);
    MongooseConnect()
});
