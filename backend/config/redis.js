const redis = require('redis');

// Create Redis client but don't connect in test environment
let client;

if (process.env.NODE_ENV === 'test') {
    // Mock Redis client for tests
    client = {
        connect: jest.fn().mockResolvedValue(),
        set: jest.fn().mockResolvedValue('OK'),
        get: jest.fn().mockResolvedValue(null),
        del: jest.fn().mockResolvedValue(1),
        expire: jest.fn().mockResolvedValue(1),
        quit: jest.fn().mockResolvedValue('OK'),
        on: jest.fn(),
        isOpen: true
    };
    console.log('Mock Redis client created for testing');
} else {
    client = new redis.createClient({
        socket: {
            host: 'localhost',
            port: 6379,
            db: 4
        }
    });

    client.connect()
        .then(() => {
            console.log('connected to redis');
        })
        .catch((error) => {
            console.log('Redis connection error:', error.message);
        });
}

module.exports = client;