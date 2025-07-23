const Userstatus = require('../model/post')
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
   
   
    const {title} = req.body;
    console.log(title);
    console.log(req.file)
  
    const image ={
        name: req.file.filename,
        path: req.file.path
    }
    console.log(data.id)
    const statuspost = {
        image:image,
        title:title,
        userid:data.id,
    }
    console.log('image',image);
    console.log('next')
    const usershow = new Userstatus(statuspost);
    usershow.save()
 
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
   const statusdata = await Userstatus.find({userid:data.id})
   if(!statusdata){
    return res.status(401).json({error:'No status found'})
   }


        console.log('succes statu send the data')
        res.status(200).json({message:'status fetched successfully',statusdata});
   console.log('statusdata',statusdata);
}
module.exports = {
    poststatus,
    postStatus
}