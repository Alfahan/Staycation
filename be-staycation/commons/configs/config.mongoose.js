const mongoose = require('mongoose');
const env = require('../../helper/env');

const options = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

let count = 0;

const connectWithRetry = () => {
    console.log('MongoDb Connection With Retry');
    mongoose
        .connect(env.Database_Server ,options)
        .then(() => {
            console.log('MongoDb is Connected');
        })
        .catch((err) => {
            console.log(
                err.message, 
                'MongoDb Connection UnSuccessFull, Retry After 5 Seconds.',
                ++count
            );
            setTimeout(connectWithRetry, 50000);
        });
};

exports.connectWithRetry = connectWithRetry;