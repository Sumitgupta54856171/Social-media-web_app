const mongoose =require('mongoose');
const { v4: uuidv4 } = require('uuid');
const messageSchema = new mongoose.Schema({
  messageId:{
    type:String,
    required:true,
    unique:true,
    default: uuidv4
  },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'userchat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'usersigmas', required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);