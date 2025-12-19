const express= require('express');
const app = express();
require('dotenv').config();
const redis = require('./config/redis')
const client = require('./config/db');
const conroller = require('./controller/login');
const cors = require('cors');
const {search,savefollower,finduser} = require('./controller/search')
const path = require('path');
const save = require('./controller/Save');
const uploads = require('./controller/Uploads');
const session = require('express-session');
const cookie = require('cookie-parser');
const jwtverify =require('./controller/jwt');
const Status = require('./controller/Status')
const { setchat } = require('./controller/chat');
const socket = require('socket.io');
const { ApolloServer } =require ('@apollo/server');
const { expressMiddleware } = require ('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } =require ('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const server = http.createServer(app);
const User = require('./model/usersigma')
const Chat = require('./model/chat')
const Message = require('./model/message')
const {Kafka} = require('kafkajs');
const {typeDefs,resolvers} = require('./model/graphsql')
const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"], 
    },
  });
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [ 'localhost:9092'],
})
const servers = new ApolloServer({typeDefs,resolvers})

app.use(cookie());
app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: false, 
		maxAge: 60*60*24*1000*7
	}
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods:["POST","GET","DEL","PUT"]
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/chats/:userId', async (req, res) => {
	try {
	  const chats = await Chat.find({
		participants: req.params.userId
	  })
	  console.log(chats)
	  
	  res.json(chats);
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  });
  app.post('/api/chats', async (req, res) => {
    console.log(req.body)

	  const { participants } = req.body;
	  
	  let chat = await Chat.findOne({
		participants: { $all: participants, $size: participants.length }
	  }).populate('participants', 'username avatar isOnline lastSeen');
	  
	  if (!chat) {
		chat = new Chat({ participants });
		await chat.save();
		chat = await Chat.findById(chat._id)
		  .populate('participants', 'username avatar isOnline lastSeen');
	  }
	
	  res.json({chat},{message:"chat created"});
  });
  app.get('/api/messages',async(req,res)=>{
	try {
		const messages = await Message.find()
		res.json(messages)
	} catch (error) {
		res.status(500).json({error:error.message})
	}
  })
  app.get('/api/messages/:chatId', async (req, res) => {
    console.log(req.params.chatId)
	try {
	  const messages = await Message.find({ chatId: req.params.chatId })
		.populate('sender', 'username avatar')
		.sort({ timestamp: 1 });
    console.log("message",messages)
	  res.json(messages);
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  });

  const producer = kafka.producer();
  const consumer = kafka.consumer({groupId: "chat-group"});
   

  const connectedUsers = new Map();
  
  io.on('connection',async (socket) => {
    await producer.connect();
    await consumer.connect();
    console.log('User connected:', socket.id);
  
    // User joins
    socket.on('user_join', async (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Update user online status
      await User.findByIdAndUpdate(userId,{ $set:{ 
        isOnline: true,
        lastSeen: new Date()
      }},{new:true,runValidators:true});
      
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
        console.log("this chat data of user : ",messageData)
         const data = {
          chatId,
          sender: senderId,
          content,
          messageType,
          timestamp: new Date()
         }
         console.log(data)
        await producer.send({
          topic:"chat-topic",
          messages:[{value:JSON.stringify(data)}],
        })
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
        console.log('send message data')
         console.log(populatedMessage)
        await consumer.subscribe({topic:"chat-topic",fromBeginning:true})
        
        // Send message to chat room

  consumer.run({
    eachMessage: async ({ message }) => {
      const msg = JSON.parse(message.value.toString());
      io.emit('receive_message', msg); 
    },
  });

        
       
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
        await User.findByIdAndUpdate(socket.userId,{ $set:{ 
          isOnline: false,
          lastSeen: new Date()
        }},{new:true,runValidators:true});
        
        // Broadcast user offline status
        socket.broadcast.emit('user_offline', socket.userId);
      }
      
      console.log('User disconnected:', socket.id);
    });
  });
  
app.get('/api/getstatus',Status.getStatus);
app.get('/api/verify',jwtverify.verifyToken)
app.post('/api/login',conroller.login);
app.post('/api/register',conroller.register);
app.post('/api/addstatus',uploads.single('image'),Status.addstatus);
app.post('/api/poststatus',uploads.single('image'),save.poststatus);
app.get('/api/getpost',save.postStatus);
app.get('/api/getprofile',Status.Profile)
app.post('/api/search',search);
app.post('/api/following',savefollower);
app.get('/api/getuser',finduser);
app.get('/api/comment/',)

async function startApolloServer(){
  await servers.start()

  app.use("/graphql",express.json(),expressMiddleware(servers))
  const port =3003;
server.listen(port,()=>{
	console.log(`server is running ${port}`);
	client;
		redis;
		
})
}

module.exports={io}

startApolloServer();



