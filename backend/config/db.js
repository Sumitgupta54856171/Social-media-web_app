const mongoose = require('mongoose');

// Use test database in test environment
const dbName = process.env.NODE_ENV === 'test' ? 'social_media_test' : 'myuserdb';
const mongoUri = `mongodb://localhost:27017/${dbName}`;

let client;

if (process.env.NODE_ENV === 'test') {
    // In test environment, don't connect immediately
    // Tests will handle connection
    client = mongoose;
    console.log('Database connection deferred for testing');
} else {
    client = mongoose.connect(mongoUri)
        .then(() => {
            console.log(`Connected to MongoDB: ${dbName}`);
            return mongoose;
        })
        .catch((error) => {
            console.log('MongoDB connection error:', error.message);
            return mongoose;
        });
}

module.exports = client;