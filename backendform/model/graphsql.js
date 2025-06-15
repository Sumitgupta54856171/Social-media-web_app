const {ApolloServer, gql} = require('apollo-server-express');
const typeDefs = gql`
type Query {
    hello: String
}
`;
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
const server = new ApolloServer({typeDefs, resolvers});
module.exports = server;
