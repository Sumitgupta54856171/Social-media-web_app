const mongoose =require('mongoose');
const bcrypt =require('bcryptjs');
const userSigma = new mongoose.Schema({
	username:{
		type:String,
		unique:true,
		required:true,
	},
	email:{
		type:String,
		required:true,
		
	},
	password:{
		type:String,
		required:true
	},
	
followers:[
	{
  type:mongoose.Schema.Types.ObjectId,
  ref:'userSigma'
	}
 ],
 following:[
	{
  type:mongoose.Schema.Types.ObjectId,
  ref:'userSigma'
	}
 ],
 
proimage:{
name:{
	type:String,

},
path:{
	type:String,
}
},

isOnline:{
	type:Boolean,
	default:false
},
lastSeen:{
	type:Date,
	default:Date.now
}
})
userSigma.pre('save',async function(next){
	if(this.isModified('password')){
		this.password = await bcrypt.hash(this.password,10);
	}
	next();
}
)
userSigma.methods.matchPassword = async function(enteredPassword){
	return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('usersigmas',userSigma);