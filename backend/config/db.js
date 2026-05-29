const mongoose = require('mongoose');

// Use test database in test environment
const dbName = process.env.NODE_ENV === 'test' ? 'social_media_test' : 'myuserdb';
const mongoUri =process.env.mongodb_url;

let client;

if (process.env.NODE_ENV === 'test') {
   
    client = mongoose;
    console.log('Database connection deferred for testing');
} else {
    client = mongoose.connect(mongoUri)
        .then(() => {
            console.log("mongodb is connected")
            return mongoose;
        })
        .catch((error) => {
            console.log('MongoDB connection error:', error.message);
            return mongoose;
        });
}

module.exports = client;