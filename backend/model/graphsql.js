const { gql } = require('graphql-tag')
const Status = require("../model/Status")
const post = require("../model/post");
const message = require('./message');
const {io}= require("../node.js")
const typeDefs = gql`

type image {
path:String
name:String

}
type comments {
    userid:String
    text:String

}
 
type Userpost {
    id:ID!
    image:image
    userid:ID!
    comment:[comments]
    statussee:Boolean
}
    type Query {
    hello:String
    getstatus(id:ID!):Userpost
    }
    type commentPost {
        id:ID!
        comment:[String]
    }
    input CommentInput {
        userid:String
        text:String
    }
    input Liketo {
    userid: String
    }
    type likepush {
        useid:String
    }
    
    type Mutation {
        Postcomment(id: String,comment: CommentInput):commentPost
         PushLike(id:String,Like:Liketo):likepush
    }
`;
const resolvers = {
    
    Query:{
        hello:()=>"graphql is work correctly",
        getstatus:async (parent,{id}) => {
             return await Status.findById(id);
        }
    },
        Mutation :{
            Postcomment:async(_,{id,comment})=>{
                post.findByIdAndUpdate(id,{$push:{Comments:comment}})
            },
            PushLike:async(_,{id,like})=>{
                post.findByIdAndUpdate(id,{$push:{like:like}})
            }
        }
      
   
    
};

module.exports = {typeDefs,resolvers}
