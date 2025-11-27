const { gql } = require('graphql-tag')
const Status = require("../model/Status")
const typeDefs = gql`

type image {
path:String
name:String

}
type Userpost {
    id:ID!
    image:image
    userid:ID!
    comment:[String]
    statussee:Boolean
}
    type Query {
    hello:String
    getstatus(id:ID!):Userpost
    }
`;
const resolvers = {
    Query: {
        hello:()=>"graphql is work correctly",
        getstatus:async (parent,{id}) => {
             return await Status.findById(id);
        }
            
    },
};

module.exports = {typeDefs,resolvers}
