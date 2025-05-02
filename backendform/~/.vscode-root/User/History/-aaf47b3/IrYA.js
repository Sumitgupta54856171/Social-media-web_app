const mongoose =require('mongoose');
const bcrypt =require('bcryptjs');
const userSigma = new mongoose.Schema({
	username:{
		type:String,
	},
	email:{
		type:String,
		require:true,
		
	},
	password:{
		type:String,
		require:true
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

module.exports = mongoose.model('userSigma',userSigma);