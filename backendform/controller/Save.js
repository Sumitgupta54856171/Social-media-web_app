const Userstatus = require('../model/usersigma')
const jwt = require('jsonwebtoken');
async function poststatus(req,res){
    console.log("hello welcome to get status")
    const token = req.cookies.sociluser;
    console.log("token", token);
    if(!token){
        return res.status(401).json({error:'No token provided'})
    }
    jwtsecret = 'ashishgupta2531';
    const data = jwt.verify(token,jwtsecret);
    console.log('decoded data',data);
   const statusdata = await Userstatus.find({username:data.username})
   if(!statusdata){
    return res.status(401).json({error:'No status found'})
   }
    const {title} = req.body;
    console.log(title);
    console.log(req.file)
  
    const image ={
        name: req.file.filename,
        path: req.file.path
    }
    const statuspost = {
        image:image,
        title:title
    }
    console.log('image',image);
    console.log('next')
    const usershow = await Userstatus.findOneAndUpdate({username:data.username}, {$push:{post:statuspost}},{new:true,runValidators: true});
 
   console.log('status saved successfully');
}
 async function postStatus(req,res){
    console.log("hello welcome to get status")
    const token = req.cookies.sociluser;
    console.log("token", token);
    if(!token){
        return res.status(401).json({error:'No token provided'})
    }
    jwtsecret = 'ashishgupta2531';
    const data = jwt.verify(token,jwtsecret);
    console.log('decoded data',data);
   const statusdata = await Userstatus.find({username:data.username})
   if(!statusdata){
    return res.status(401).json({error:'No status found'})
   }

   console.log('statusdata',statusdata);
   console.log(statusdata[0].post[0])
   const statusdata1 = statusdata[0].post
const username = statusdata.map((post)=>post.username)
  console.log('usename',username);


        console.log('succes statu send the data')
        res.status(200).json({message:'status fetched successfully',statusdata1});
   console.log('statusdata',statusdata);
}
module.exports = {
    poststatus,
    postStatus
}