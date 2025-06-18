const mongoose =require('mongoose');
const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);