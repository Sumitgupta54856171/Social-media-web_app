const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
	userid:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'userSigma',
		required: true
	},
    title: {
        type: String,
    },
    image:{
	name:{
        type: String,
	},
	path:{
		type:String,
	}
},
see:{
	type:Number,
	default:0,
},
createdAt: {
	type: Date,
	default: Date.now,
},
Comments: [{
	text:{
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSigma'
    },
}],
like: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'userSigma',
},
title:{
	type: String,
}

});
module.exports = mongoose.model("post",postSchema)