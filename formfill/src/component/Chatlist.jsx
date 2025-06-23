import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from "axios";
import { useContext } from 'react';
import { Authcontext } from '../context';

const WhatsAppClone = () => {
  const {username} = useContext(Authcontext);

  const [currentUser, setCurrentUser] = useState(null);
  console.log("to check the current user ",currentUser)
  useEffect(()=>{
    const Userlist = async()=>{
      const res = await axios.get('http://localhost:3003/api/getuser',{withCredentials:true})
      setUsers(res.data.userlist2)
    }
    Userlist()
  },[])
  useEffect(()=>{
    const userss = async( )=>{
    const userdata = await axios.get('http://localhost:3003/api/getprofile',{withCredentials:true})
    setCurrentUser(userdata.data.profiledata[0])
    }
    userss()
  },[])
  const localvideoref = useRef();
  const remotevideoref = useRef();
  const [mystream,setmystream] = useState(null)
  const [remoteStreams,setremotestreams] = useState({})
  const peerconnections = useRef({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useRef(io('http://localhost:3003'))
 useEffect(() => {
  // Only run if currentUser is a valid object with an _id
  if (currentUser && currentUser._id) {
    const fetchchat = async () => {
      try {
        const res = await axios.get(`http://localhost:3003/api/chats/${currentUser._id}`, { withCredentials: true });
        setChats(Array.isArray(res.data.chats) ? res.data.chats : []);
      } catch (err) {
        setChats([]); // fallback to empty array on error
      }
    };
    fetchchat();
  } else {
    setChats([]); // clear chats if currentUser is not valid
  }
}, [currentUser && currentUser._id]);
async function createOrGetChat({participants}){
  const res = await axios.post('http://localhost:3003/api/chats',{participants},{withCredentials:true}) 
 return res.data.chat
}
  // Mock messages for active chat
  useEffect(() => {
    // Ensure activeChat is a valid object with an _id to avoid errors in filter/map
    if (activeChat && typeof activeChat === 'object' && activeChat._id && socket.current) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:3003/api/messages/${activeChat._id}`, { withCredentials: true });
          console.log("check the data in activeChat", res.data)
          setMessages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          setMessages([]); // fallback to empty array on error
        }
      };
      fetchMessages();
    } else {
      setMessages([]); // clear messages if activeChat is not valid
    }
  }, [activeChat && activeChat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = (message) => {
      if(activeChat && activeChat._id === message.chatId){
        console.log("send by the backend database",message)
        setMessages(prev => [...prev, message]);
      }
      setChats(prev => prev.map(chat => 
        chat._id == message.chatId 
          ? { ...chat, lastMessage: { content: message.content, sender: message.sender, timestamp: message.timestamp }}
          : chat
      ));
    };

    const handleChatUpdated = (updatedChat) => {
      setChats(prev => {
        const existingIndex = prev.findIndex(chat => chat._id === updatedChat._id);
        if (existingIndex >= 0) {
          const newChats = [...prev];
          newChats[existingIndex] = updatedChat;
          return newChats;
        }
        return [updatedChat, ...prev];
      });
    };

    const handleUserTyping = (userId, username) => {
      setTypingUsers(prev => [...prev.filter(u => u !== username), username]);
    };

    const handleUserStopTyping = (userId) => {
      const user = users.find(u => u._id === userId);
      if (user) {
        setTypingUsers(prev => prev.filter(u => u !== user.username));
      }
    };

    const handleUserOnline = (userId) => {
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isOnline: true } : user
      ));
    };

    const handleUserOffline = (userId) => {
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isOnline: false, lastSeen: new Date() } : user
      ));
    };

    socket.current.on('receive_message', handleReceiveMessage);
    socket.current.on('chat_updated', handleChatUpdated);
    socket.current.on('user_typing', handleUserTyping);
    socket.current.on('user_stop_typing', handleUserStopTyping);
    socket.current.on('user_online', handleUserOnline);
    socket.current.on('user_offline', handleUserOffline);

    return () => {
      if (socket.current) {
        socket.current.off('receive_message', handleReceiveMessage);
        socket.current.off('chat_updated', handleChatUpdated);
        socket.current.off('user_typing', handleUserTyping);
        socket.current.off('user_stop_typing', handleUserStopTyping);
        socket.current.off('user_online', handleUserOnline);
        socket.current.off('user_offline', handleUserOffline);
      }
    };
  }, [activeChat, users]);
  const sendMessage = () => {

    if (newMessage.trim() && activeChat) {
      const message = {
        _id: Date.now().toString(),
        chatId: activeChat._id,
        sender: currentUser._id,
        content: newMessage,
        timestamp: new Date()
      };
      socket.current.emit('send_message', {
        chatId: activeChat._id,
        senderId: currentUser._id,
        content: newMessage
      });
   
      setNewMessage('');
      setChats(prev => prev.map(chat =>
        chat._id === activeChat._id
          ? { ...chat, lastMessage: { content: newMessage, sender: currentUser._id, timestamp: new Date() }} 
          : chat
      ));
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const startNewChat = async (user) => {
    const existingChat = chats.find(chat => 
      chat.participants.some(p => p._id === user._id)
    );
  
    console.log(existingChat)
    console.log(chats)
    console.log('check the exitstingchat')
    if (existingChat&& existingChat !== null&& existingChat !== undefined) {
      setActiveChat(existingChat);
    } else {
      const participants = [currentUser._id, user._id];
      const newChat = await createOrGetChat({participants});
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
    }
    setShowUserList(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const otherUser = activeChat ? activeChat.participants.find(p => p._id !== currentUser?._id) : null;

  const filteredChats = chats.filter(chat =>
    (chat.participants.find(p => p._id !== currentUser?._id)?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <>
    {currentUser &&
    <div className="h-screen w-full flex bg-gray-100 font-sans">
      {/* Left Panel (Chat List) */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          {currentUser && (
            <img src={currentUser.avatar} alt="My Avatar" className="w-10 h-10 rounded-full" />
          )}
          <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
          <button onClick={() => setShowUserList(!showUserList)} className="p-2 rounded-full hover:bg-gray-200">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List or User List */}
        <div className="flex-1 overflow-y-auto">
          {showUserList ? (
            <div>
              <div className="p-3 bg-green-50 text-green-700 text-sm font-medium">
                Start new conversation
              </div>
              {users.filter(u => u._id !== currentUser?._id).map(user => (
                <div
                  key={user._id}
                  onClick={() => startNewChat(user)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredChats.map(chat => {
              const otherParticipant = chat.participants.find(p => p._id !== currentUser?._id);
              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3 ${activeChat?._id === chat._id ? 'bg-green-50' : ''}`}>
                  <div className="relative">
                    <img src={otherParticipant?.avatar} alt={otherParticipant?.username} className="w-12 h-12 rounded-full" />
                    {otherParticipant?.isOnline && <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-gray-800 truncate">{otherParticipant?.username}</h2>
                      {chat.lastMessage && (
                        <p className="text-xs text-gray-500 whitespace-nowrap">{formatTime(chat.lastMessage.timestamp)}</p>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.sender === currentUser?._id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel (Chat Window) */}
      <div className={`w-full md:w-2/3 lg:w-3/4 flex-col ${activeChat ? 'flex' : 'hidden md:flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <img src={otherUser?.avatar} alt={otherUser?.username} className="w-10 h-10 rounded-full" />
                <div>
                  <h2 className="font-semibold text-gray-800">{otherUser?.username}</h2>
                  <p className="text-xs text-gray-500">
                    {otherUser?.isOnline ? 'Online' : formatLastSeen(otherUser?.lastSeen)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
              {messages && Array.isArray(messages) &&
              
                messages.map(message => {
                  
                  const isOwn = message.sender._id === currentUser._id;
                  return (
                    <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${isOwn
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-12 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nev Web</h2>
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>}</>
  );
};

export default WhatsAppClone;