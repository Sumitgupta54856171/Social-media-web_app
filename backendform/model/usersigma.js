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
 status:[{
	image:{
		name:{
		 type:String,
    },
		path:{
			type:String,
    }
	},
	see:{
		type:Number,
		default:0,
	},
	statussee:{
		type:Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	Comments: [{
		type: String,
	}],
	like: {
		type: Number,
		default: 0,
	},
	title:{
		type: String,
	}}
]
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