const User = require('model/usersigma');
const Schema = buildSchema(
    `
    type Query{
    hello:String
    user(id:ID!):User
    }
    type Mutation {
    createuser(name:String!,email:String!):User
    }
    type User{
    id:ID!
    name:String
    email:String
    }
    `
);
module.exports = {
    Schema
}