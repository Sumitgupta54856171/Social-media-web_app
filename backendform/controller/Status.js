const Userstatus = require('../model/Status');
const jwt = require('jsonwebtoken');
async function addstatus(req,res){
    console.log("hello welcome to get status")
			const token = req.cookies.sociluser;
			console.log("token", token);
			if(!token){
				return res.status(401).json({error:'No token provided'})
			}
			jwtsecret = 'ashishgupta2531';
			const data = jwt.verify(token,jwtsecret);
			console.log('decoded data',data);
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
        title:"hello world",
        userid:data.id
    }
    console.log('image',image);
    console.log('next')
    const usershow = new Userstatus(statusdata);
    usershow.save()
    console.log('status saved successfully');
   
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
   const statusdata1 = await Userstatus.find({userid:data.id})
   if(!statusdata1){
    return res.status(401).json({error:'No status found'})
   }
        console.log('succes statu send the data')
        res.status(200).json({message:'status fetched successfully',statusdata1});
   
}
const Profile =async(req,res)=>{
    const token = req.cookies.sociluser;
    console.log("hello welcome profile of the user ")
    console.log("profile",token);
    if(!token){
        return res.status(401).json({error:'No token provided'})
    }
    jwtsecret = 'ashishgupta2531';
    const data = jwt.verify(token,jwtsecret);
    console.log('decoded data',data);
    const profiledata = await Userstatus.find({username:data.username})
    console.log('profiledata',profiledata);
    return res.status(200).json({message:'profile fetched successfully',profiledata});
}
const Search =async(req,res)=>{
    const {username} = req.body;
    const token = req.cookies.sociluser;
    console.log("hello welcome search of the user ")
    console.log("profile",token);
    if(!token){
        return res.status(401).json({error:'No token provided'})
    }
    jwtsecret = 'ashishgupta2531';
    const data = jwt.verify(token,jwtsecret);
    console.log('decoded data',data);
    const searchdata = await Userstatus.find({})
    console.log('profiledata',searchdata);
    
    for(let i = 0; i < searchdata.length; i++){
        if(searchdata[i].username === username){
            const searchdata1 = searchdata[i]
            return res.status(200).json({message:'profile fetched successfully',searchdata1});
        }
    }
    return res.status(401).json({error:'No profile found'})
}
module.exports = {
    addstatus,
    getStatus,
    Profile,
    Search
}
