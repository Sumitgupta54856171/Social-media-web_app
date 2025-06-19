import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';

// API and Socket URLs - Update these to match your backend server
const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Socket.io client setup
const initializeSocket = () => {
  // For Claude.ai artifacts, we'll use a mock socket
  // In your actual project, replace this with: import io from 'socket.io-client';
  
  if (typeof window !== 'undefined' && window.io) {
    // Real Socket.io client
    return window.io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true
    });
  } else {
    // Mock socket for development/demo
    const listeners = {};
    return {
      emit: (event, data) => {
        console.log('Socket emit:', event, data);
        // Simulate server responses for demo
        if (event === 'user_join') {
          setTimeout(() => {
            listeners['user_online']?.forEach(cb => cb(data));
          }, 100);
        }
      },
      on: (event, callback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
      },
      off: (event, callback) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(cb => cb !== callback);
        }
      },
      disconnect: () => console.log('Socket disconnected'),
      connected: false,
      trigger: (event, data) => {
        if (listeners[event]) {
          listeners[event].forEach(callback => callback(data));
        }
      }
    };
  }
};

const WhatsAppClone = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await apiCall('/users');
      setUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to mock data
      setUsers([
        { _id: '2', username: 'Alice Johnson', avatar: '👩', isOnline: true },
        { _id: '3', username: 'Bob Smith', avatar: '👨', isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
        { _id: '4', username: 'Carol White', avatar: '👩‍💼', isOnline: true },
        { _id: '5', username: 'David Brown', avatar: '👨‍💻', isOnline: false, lastSeen: new Date(Date.now() - 7200000) }
      ]);
    }
  };

  const fetchChats = async (userId) => {
    try {
      const chats = await apiCall(`/chats/${userId}`);
      setChats(chats);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      // Fallback to mock data
      const mockChats = [
        {
          _id: 'chat1',
          participants: [currentUser, users.find(u => u._id === '2')].filter(Boolean),
          lastMessage: {
            content: 'Hey, how are you doing?',
            sender: users.find(u => u._id === '2') || { username: 'Alice' },
            timestamp: new Date(Date.now() - 1800000)
          }
        }
      ];
      setChats(mockChats);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const messages = await apiCall(`/messages/${chatId}`);
      setMessages(messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Fallback to mock data
      setMessages([
        {
          _id: 'msg1',
          chatId: chatId,
          sender: { _id: '2', username: 'Alice Johnson', avatar: '👩' },
          content: 'Hey there! How are you?',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          _id: 'msg2',
          chatId: chatId,
          sender: currentUser,
          content: 'I\'m doing great, thanks! How about you?',
          timestamp: new Date(Date.now() - 3500000)
        }
      ]);
    }
  };

  const createOrGetChat = async (participants) => {
    try {
      const chat = await apiCall('/chats', {
        method: 'POST',
        body: JSON.stringify({ participants }),
      });
      return chat;
    } catch (error) {
      console.error('Failed to create/get chat:', error);
      // Fallback to creating a mock chat
      const newChat = {
        _id: `chat_${Date.now()}`,
        participants: participants.map(id => users.find(u => u._id === id) || currentUser).filter(Boolean),
        lastMessage: null
      };
      return newChat;
    }
  };

  const createUser = async (userData) => {
    try {
      const user = await apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Initialize Socket.io connection
        socket.current = initializeSocket();
        
        // Socket connection events
        socket.current.on('connect', () => {
          console.log('Connected to server');
          setSocketConnected(true);
          setError(null);
        });
        
        socket.current.on('disconnect', () => {
          console.log('Disconnected from server');
          setSocketConnected(false);
          setError('Connection lost. Reconnecting...');
        });
        
        socket.current.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setSocketConnected(false);
          setError('Failed to connect to server');
        });
        
        // Initialize current user (in a real app, this would come from authentication)
        let user = JSON.parse(localStorage.getItem('whatsapp_user') || 'null');
        
        if (!user) {
          // Create a demo user
          const userData = {
            username: `User_${Math.floor(Math.random() * 1000)}`,
            email: `user${Math.floor(Math.random() * 1000)}@example.com`,
            avatar: '👤'
          };
          
          try {
            user = await createUser(userData);
            localStorage.setItem('whatsapp_user', JSON.stringify(user));
          } catch (error) {
            // Fallback to mock user
            user = { _id: `user_${Date.now()}`, username: userData.username, avatar: '👤' };
            localStorage.setItem('whatsapp_user', JSON.stringify(user));
          }
        }
        
        setCurrentUser(user);
        
        // Fetch initial data
        await fetchUsers();
        
        // Connect socket with user
        if (socket.current && user) {
          socket.current.emit('user_join', user._id);
        }
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Failed to initialize app. Using offline mode.');
        
        // Set fallback user
        const fallbackUser = { _id: `user_${Date.now()}`, username: 'You', avatar: '👤' };
        setCurrentUser(fallbackUser);
        localStorage.setItem('whatsapp_user', JSON.stringify(fallbackUser));
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
    
    // Cleanup socket on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Fetch chats when user is loaded
  useEffect(() => {
    if (currentUser) {
      fetchChats(currentUser._id);
    }
  }, [currentUser]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat && socket.current) {
      fetchMessages(activeChat._id);
      socket.current.emit('join_chat', activeChat._id);
    }
  }, [activeChat]);

  // Socket event listeners
  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = (message) => {
      if (activeChat && message.chatId === activeChat._id) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update chat list
      setChats(prev => prev.map(chat => 
        chat._id === message.chatId 
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

    const handleUserTyping = ({ userId, username }) => {
      setTypingUsers(prev => [...prev.filter(u => u !== username), username]);
    };

    const handleUserStopTyping = ({ userId }) => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && activeChat && currentUser) {
      const messageData = {
        chatId: activeChat._id,
        senderId: currentUser._id,
        content: newMessage,
        messageType: 'text'
      };

      // Optimistically add message to UI
      const optimisticMessage = {
        _id: `temp_${Date.now()}`,
        chatId: activeChat._id,
        sender: currentUser,
        content: newMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      // Update chat's last message optimistically
      setChats(prev => prev.map(chat => 
        chat._id === activeChat._id 
          ? { ...chat, lastMessage: { content: newMessage, sender: currentUser, timestamp: new Date() }}
          : chat
      ));

      // Send via socket
      if (socket.current && socketConnected) {
        socket.current.emit('send_message', messageData);
      }

      // Stop typing indicator
      if (socket.current && socketConnected) {
        socket.current.emit('typing_stop', {
          chatId: activeChat._id,
          userId: currentUser._id
        });
      }
    }
  };

  const startNewChat = async (user) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const existingChat = chats.find(chat => 
        chat.participants.some(p => p._id === user._id)
      );

      if (existingChat) {
        setActiveChat(existingChat);
      } else {
        const participants = [currentUser._id, user._id];
        const newChat = await createOrGetChat(participants);
        
        // Add participants data if not already populated
        if (newChat.participants.every(p => typeof p === 'string')) {
          newChat.participants = [currentUser, user];
        }
        
        setChats(prev => [newChat, ...prev]);
        setActiveChat(newChat);
      }
      setShowUserList(false);
    } catch (error) {
      console.error('Failed to start new chat:', error);
      setError('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (activeChat && currentUser && e.target.value.trim() && socket.current && socketConnected) {
      socket.current.emit('typing_start', {
        chatId: activeChat._id,
        userId: currentUser._id,
        username: currentUser.username
      });
    } else if (activeChat && currentUser && socket.current && socketConnected) {
      socket.current.emit('typing_stop', {
        chatId: activeChat._id,
        userId: currentUser._id
      });
    }
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
    const otherUser = chat.participants.find(p => p._id !== currentUser?._id);
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user._id !== currentUser?._id &&
    !chats.some(chat => chat.participants.some(p => p._id === user._id))
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Loading WhatsApp...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {error && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded z-50">
          {error}
        </div>
      )}
      
      {/* Connection Status */}
      <div className="absolute top-4 left-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          socketConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            socketConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>{socketConnected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {currentUser?.username}
              </div>
              <button 
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
            </div>
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
              {filteredUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => startNewChat(user)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl">{user.avatar}</span>
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
            const otherUser = chat.participants.find(p => p._id !== currentUser?._id);
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
                    <span className="text-2xl">{otherUser?.avatar || '👤'}</span>
                    {otherUser?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">
                        {otherUser?.username || 'Unknown User'}
                      </div>
                      {chat.lastMessage && (
                        <div className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </div>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <div className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.sender._id === currentUser?._id ? 'You: ' : ''}
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
                    {activeChat.participants.find(p => p._id !== currentUser?._id)?.avatar || '👤'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {activeChat.participants.find(p => p._id !== currentUser?._id)?.username || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeChat.participants.find(p => p._id !== currentUser?._id)?.isOnline 
                        ? 'Online' 
                        : `Last seen ${formatLastSeen(activeChat.participants.find(p => p._id !== currentUser?._id)?.lastSeen)}`
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
                const isOwn = message.sender._id === currentUser?._id;
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
                    onChange={handleTyping}
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
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {error && (
                <p className="text-yellow-600 mt-2 text-sm">
                  Running in offline mode - some features may be limited
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppClone;