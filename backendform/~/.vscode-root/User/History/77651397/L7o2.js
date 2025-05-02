const User = require('../model/usersigma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
async function login(req,res){
    console.log(req.body);
    const {email,password} = req.body;  
    
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
            res.redirect('/login');
        })
        .catch((err) => {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        });
    console.log('User registered successfully');
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