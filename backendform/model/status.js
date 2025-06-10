const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema({
username:{
	type:String,
	require:true,
	unique:true,
},
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
	}
})
module.exports = mongoose.model('Usershowstatus',statusSchema);