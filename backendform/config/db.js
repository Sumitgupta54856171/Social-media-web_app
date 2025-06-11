const mongoose = require('mongoose');
const client = mongoose.connect('mongodb://localhost:27017/myuserdb')
.then(()=>{
	console.log("connected the mongodb");
})
.catch((error)=>{
	console.log(error);
})
module.exports =client;