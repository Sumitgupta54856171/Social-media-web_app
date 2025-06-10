const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    image:{
        type:String,
    },
    like:{
        type:Number,
        default:0,
    },comments:[{
        type:String,
    }],
    username:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})