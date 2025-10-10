const Message = require('../model/message');

const setchat = async (data) => {
  try {
    const { chatId, senderId, content } = data;

    if (!chatId || !senderId || !content) {
      console.error("Validation Error: Missing required fields to save chat.");
      return;
    }

    const newMessage = new Message({
      chatId: chatId,
      sender: senderId, // Map senderId from frontend to sender in schema
      content: content,
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Generate a simple unique ID
    });

    await newMessage.save();
    console.log('Message saved to DB');
  } catch (error) {
    console.error('Error saving message to DB:', error);
  }
};

module.exports = {
    setchat
};
