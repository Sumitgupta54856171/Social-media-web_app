const Userstatus = require('../model/usersigma')
const jwt = require('jsonwebtoken');
async function addstatus(req,res){
    const {username} = req.body;
    console.log(username);
    console.log(req.file)
    if(!username){
        return res.status(400).json({error:'username is required'})
    }
    const image ={
        name: req.file.filename,
        path: req.file.path
    }
    const statusdata = {
        image:image,
        title:"hello world"
    }
    console.log('image',image);
    console.log('next')
    const usershow = await Userstatus.findOneAndUpdate({username:username}, {$push:{status:statusdata}},{new:true,runValidators: true});
    if(usershow){
        console.log('user already exists');
    }
   console.log('status saved successfully');
}
 async function getStatus(req,res){
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
   console.log(statusdata[0].status[0])
   const statusdata1 = statusdata[0].status
const username = statusdata.map((status)=>status.username)
  console.log('usename',username);


        console.log('succes statu send the data')
        res.status(200).json({message:'status fetched successfully',statusdata1});
   console.log('statusdata',statusdata);
}
module.exports = {
    addstatus,
    getStatus
}
