const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema(
    {
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userSigma',
		required:true
    },
	image:{
		name:{
		 type:String,
    },
		path:{
			type:String,
    }
	},
	see:[{
		userid:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"userSigm",
			unique:true
		}
	}],
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
      createdAt: {
        type: Date,
        default: Date.now 
    }
	}
   // Index for sorting by creation date
)
statusSchema.index({ createdAt: 1 },{expireAfterSecond:86400}); 
module.exports = mongoose.model("status",statusSchema)