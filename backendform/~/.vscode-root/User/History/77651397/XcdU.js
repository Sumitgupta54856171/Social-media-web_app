const User = require('../model/usersigma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
async function login(req,res){
    console.log(req.body);
    const {email,password} = req.body;  
    
        try{
            const user = await User.findOne({email});
            if(!user){
                return console.log('Invalid email or password');
            }
            
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return console.log('Invalid email or password');
            }
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRE
            });
            console.log({token});
        }catch(err){
            console.log(err);
        }
        console.log('Login successful');
    
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
    redirect('/')
}
module.exports = {
    login,
    register
}