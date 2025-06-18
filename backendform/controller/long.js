app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({}, '-__v');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create user
  app.post('/api/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get user's chats
  app.get('/api/chats/:userId', async (req, res) => {
    try {
      const chats = await Chat.find({
        participants: req.params.userId
      })
      .populate('participants', 'username avatar isOnline lastSeen')
      .populate('lastMessage.sender', 'username')
      .sort({ 'lastMessage.timestamp': -1 });
      
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create or get chat between users
  app.post('/api/chats', async (req, res) => {
    try {
      const { participants } = req.body;
      
      // Check if chat already exists
      let chat = await Chat.findOne({
        participants: { $all: participants, $size: participants.length }
      }).populate('participants', 'username avatar isOnline lastSeen');
      
      if (!chat) {
        chat = new Chat({ participants });
        await chat.save();
        chat = await Chat.findById(chat._id)
          .populate('participants', 'username avatar isOnline lastSeen');
      }
      
      res.json(chat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  
  // Socket.io connection handling
  const connectedUsers = new Map();
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // User joins
    socket.on('user_join', async (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Update user online status
      await User.findByIdAndUpdate(userId, { 
        isOnline: true,
        lastSeen: new Date()
      });
      
      // Join user to their chat rooms
      const chats = await Chat.find({ participants: userId });
      chats.forEach(chat => {
        socket.join(chat._id.toString());
      });
      
      // Broadcast user online status
      socket.broadcast.emit('user_online', userId);
    });
  
    // Join chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });
  
    // Handle new message
    socket.on('send_message', async (messageData) => {
      try {
        const { chatId, senderId, content, messageType = 'text' } = messageData;
        
        // Save message to database
        const message = new Message({
          chatId,
          sender: senderId,
          content,
          messageType,
          timestamp: new Date()
        });
        
        await message.save();
        
        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: {
            content,
            sender: senderId,
            timestamp: new Date()
          }
        });
        
        // Populate message with sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar');
        
        // Send message to chat room
        io.to(chatId).emit('receive_message', populatedMessage);
        
        // Send chat list update to participants
        const updatedChat = await Chat.findById(chatId)
          .populate('participants', 'username avatar isOnline lastSeen')
          .populate('lastMessage.sender', 'username');
        
        updatedChat.participants.forEach(participant => {
          const socketId = connectedUsers.get(participant._id.toString());
          if (socketId) {
            io.to(socketId).emit('chat_updated', updatedChat);
          }
        });
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: error.message });
      }
    });
  
    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(data.chatId).emit('user_typing', {
        userId: data.userId,
        username: data.username
      });
    });
  
    socket.on('typing_stop', (data) => {
      socket.to(data.chatId).emit('user_stop_typing', {
        userId: data.userId
      });
    });
  
    // Handle disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        
        // Update user offline status
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date()
        });
        
        // Broadcast user offline status
        socket.broadcast.emit('user_offline', socket.userId);
      }
      
      console.log('User disconnected:', socket.id);
    });
  });
  