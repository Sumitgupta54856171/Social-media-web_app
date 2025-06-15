const {kafka} = require('kafkajs');
const kafka = new Kafka({
    clientId:'myapp',
    brokers:['localhost:9092']
})
const producer = kafka.producer();
module.exports = producer;