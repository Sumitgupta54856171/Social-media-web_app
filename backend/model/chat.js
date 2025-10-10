
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usersigmas' }],
    lastMessage: {
      content: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'usersigmas' },
      timestamp: { type: Date, default: Date.now }
    },
    createdAt: { type: Date, default: Date.now }
  });
module.exports = mongoose.model("userchat",chatSchema)