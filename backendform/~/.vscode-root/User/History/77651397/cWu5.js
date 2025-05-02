const User = require('../model/usersigma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
function login({email,password}){
    return new Promise(async (resolve,reject)=>{
        try{
            const user = await User.findOne({email});
            if(!user){
                return reject('Invalid email or password');
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return reject('Invalid email or password');
            }
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRE
            });
            resolve({token});
        }catch(err){
            reject(err);
        }
        redirect('/');
    })
}
function register(){
    console.log('--- REGISTER ROUTE HIT ---');
        console.log('Request Method:', req.method);
            console.log('Request Headers:', req.headers);
                console.log('Request Body (raw):', req.body); // <<< MOST IMPORTANT LOG
                
    console.log('register function called');
    console.log(req.body);
    
    return new Promise(async (resolve,reject)=>{
        
        try{
            const user = await User.findOne({email});
            if(user){
                return reject('User already exists');
            }
            const newUser = await User.create({
                username,
                email,
                password
            });
            resolve('User registered successfully');
            
           newUser.save();
        }catch(err){
            reject(err);
            console.log(err);
        }
    })
    redirect('/')
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