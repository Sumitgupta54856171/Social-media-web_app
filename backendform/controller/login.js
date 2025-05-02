const User = require('../model/usersigma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');
let transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"guptaashish2531@gmail.com",
        passord:"7$Ashish"
    }
})

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
                return console.log('Invalid email or password');
            }
            const payload = {
                id:user._id,
                username:user.username,
                email:user.email
            };
           
            const token = jwt.sign(payload,jwt_secrt,{ expiresIn:'1h'});
            req.session.token = token;
            req.session.user = user._id;
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
    try{
        const user = await User.findOne({email});
        function generatedotp(){
            let otp =  1000+Math.random*9000;
            console.log(otp);
            return otp
        }
       
       
    
   
    if(user){
        console.log('User already exists');
        return res.status(400).send('User already exists');
    }
    let mailOptions={
        from:'guptaashish2531@gmail.com',
        to:user.email,
        subject:"hello from postclone",
        text :`This is a one time password of form otp ${generateotp} `,
    }
    transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log('Kuch galat ho gaya:' ,error);
        }else{
            console.log("Email successfully bhej diya :", info.response);
        }
    });}catch(err){
        console.log(err)
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