const jwt = require('jsonwebtoken');
const {getsession} = require('../model/session');
function verifyToken(req, res) {
   const token = req.cookies.sociluser;
   const jwtsecrt = 'ashishgupta2531';
   console.log("token", token);
  if(!token){
        return res.status(401).json({error:'No token provided'})
    }
        const decoded = jwt.verify(token,jwtsecrt);
        console.log('decoded');
        console.log(decoded);
        console.log(decoded.email);
        getsession(decoded.username);
        console.log('sesssion')
        if(!decoded){
            return res.status(401).json({error:'Invalid token'})
        }
        console.log("the data of session is fetch",decoded);
        res.json({message: "Token verified successfully", user: decoded});
}

module.exports = { verifyToken };