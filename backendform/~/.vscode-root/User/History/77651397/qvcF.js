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
            
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRE
            });
            console.log({token});
        }catch(err){
            console.log(err);
        }
        console.log('Login successful');
    
}
function register(req,res){
    console.log(req.body);
    const {email,password} = req.body;
    console.log(email);
    const user = new User({
        email,
        password
    });
    user.save()
        .then(() => {
            console.log('User registered successfully');
            
        })
        .catch((err) => {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        });
    console.log('User registered successfully');
    
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