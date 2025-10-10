const User = require('../model/usersigma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {setsession} = require('../model/session');

async function login(req,res){
    console.log(req.body);
    const {email,password} = req.body;  
    const jwt_secrt = 'ashishgupta2531';
        try{
            const user = await User.findOne({email});
            if(!user){
                return console.log('Invalid email or password');
            }
            
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                console.log(await bcrypt.compare(password,user.password))
                return console.log('Invalid email or password');
            }
            const payload = {
                id:user._id,
                username:user.username,
                email:user.email
            };
           
            const token = jwt.sign(payload,jwt_secrt,{ expiresIn:60*60*24*7*1000});
            res.cookie('sociluser',token,{
                httpOnly:true,
                maxAge:60*60*24*7*1000
            });
            setsession(user.username,payload);
            res.json({ token });
            console.log('Login successful');
        }catch(err){
            console.log(err);
        }
}
async function register(req,res){
    const {username,email,password} = req.body;
    console.log(req.body);
    console.log('Registering user:', username, email, password);
    
        const user = await User.findOne({email});
      
    if(user){
        console.log('User already exists');
        return res.status(400).send('User already exists');
    }

    const  newUser = new User({
        username:username,
        email:email,
        password:password
    });
    newUser.save()
        .then(() => {
            console.log('User registered successfully');
        })
        .catch((err) => {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        });
}
function logout(){
    return new Promise((resolve,reject)=>{
        try{
            resolve('Logout successful');
        }catch(err){
            reject(err);
        }
    })
    
}
module.exports = {
    login,
    register
}