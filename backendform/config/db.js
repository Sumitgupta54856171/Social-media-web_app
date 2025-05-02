const mongoose = require('mongoose');
const client = mongoose.connect('mongodb+srv://guptaashish2531:12345687@cluster0.ydgkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
	console.log("connected the mongodb");
})
.catch((error)=>{
	console.log(error);
})
module.exports =client;