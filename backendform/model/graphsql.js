const {ApolloServer, gql} = require('apollo-server-express');
const typeDefs = gql`
type Userpost {
    post:String,
    like:number,
    comment:array,
    
}
`;
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
const server = new ApolloServer({typeDefs, resolvers});
module.exports = server;
