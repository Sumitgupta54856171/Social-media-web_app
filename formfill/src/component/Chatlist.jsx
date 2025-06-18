import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from "axios";
import { useContext } from 'react';
import { Authcontext } from '../context';

const WhatsAppClone = () => {
  const {current,username} = useContext(Authcontext);
  const [currentUser, setCurrentUser] = useState({ 
    _id:current, 
    username:username, 
    avatar: '👤' 
  });
  useEffect(()=>{
    const Userlist = async()=>{
      const res = await axios.get('http://localhost:3003/api/getuser',{withCredentials:true})
      console.log(res.data.userlist2)
      setUsers(res.data.userlist2)
    }
    Userlist()
  },[])
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState();
  const [showUserList, setShowUserList] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socket = io.connect('http://localhost:3003'); 

  
  
    
 useEffect(()=>{
const fetchchat = async()=>{
    const res = await axios.get(`http://localhost:3003/api/chats/${currentUser._id}`,{withCredentials:true})
    setChats(res.data.chats)
}
fetchchat()
},[])

  // Mock messages for active chat
  useEffect(() => {
    const fetchmessages = async()=>{
    const res = await axios.get(`http://localhost:3003/api/messages/${activeChat._id}`,{withCredentials:true})
    setMessages(res.data.messages)  
    }
    fetchmessages()
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const message = {
        _id: Date.now().toString(),
        chatId: activeChat._id,
        sender: currentUser,
        content: newMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat._id === activeChat._id 
          ? { ...chat, lastMessage: { content: newMessage, sender: currentUser, timestamp: new Date() }}
          : chat
      ));

      // Emit to socket (in real app)
      socket.current.emit('send_message', {
        chatId: activeChat._id,
        senderId: currentUser._id,
        content: newMessage
      });
    }
  };

  const startNewChat = (user) => {
    const existingChat = chats.find(chat => 
      chat.participants.some(p => p._id === user._id)
    );

    if (existingChat) {
      setActiveChat(existingChat);
    } else {
      const newChat = {
        _id: `chat_${Date.now()}`,
        participants: [currentUser, user],
        lastMessage: null
      };
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

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p._id !== currentUser._id);
    return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
            <button 
              onClick={() => setShowUserList(!showUserList)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <MoreVertical size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {showUserList && (
            <div className="border-b border-gray-200">
              <div className="p-3 bg-green-50 text-green-700 text-sm font-medium">
                Start new conversation
              </div>
              {users.map(user => (
                <div
                  key={user._id}
                  onClick={() => startNewChat(user)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl">{user.username}</span>
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
          )}

          {filteredChats.map(chat => {
            const otherUser = chat.participants.find(p => p._id !== currentUser._id);
            return (
              <div
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  activeChat?._id === chat._id ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="text-2xl">{otherUser?.avatar}</span>
                    {otherUser?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">
                        {otherUser?.username}
                      </div>
                      {chat.lastMessage && (
                        <div className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </div>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <div className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.sender._id === currentUser._id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {activeChat.participants.find(p => p._id !== currentUser._id)?.avatar}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {activeChat.participants.find(p => p._id !== currentUser._id)?.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeChat.participants.find(p => p._id !== currentUser._id)?.isOnline 
                        ? 'Online' 
                        : `Last seen ${formatLastSeen(activeChat.participants.find(p => p._id !== currentUser._id)?.lastSeen)}`
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map(message => {
                const isOwn = message.sender._id === currentUser._id;
                return (
                  <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn 
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
              })}
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
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">WhatsApp Web</h2>
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppClone;