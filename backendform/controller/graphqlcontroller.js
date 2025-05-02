const User = require('../model/usersigma');
const root  ={
 hello:()=>"hello graphql",
 user:async({id})=>{
await User.findById(id),
await user.save(),
 }
}