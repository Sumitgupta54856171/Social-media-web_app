import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from "axios";
import { Authcontext } from "../context";

// Backend and Socket URLs
const API_BASE_URL = 'http://localhost:3003/api';
const SOCKET_URL = 'http://localhost:3003';

const WhatsAppClone = () => {
  const { user: currentUser } = useContext(Authcontext);

  // State variables for chat application
  const [chats, setChats] = useState([]); // List of all chats for the current user
  const [activeChat, setActiveChat] = useState(null); // The currently open chat
  const [messages, setMessages] = useState([]); // Messages in the active chat
  const [newMessage, setNewMessage] = useState(''); // Content of the message being typed
  const [users, setUsers] = useState([]); // List of all registered users (contacts)
  const [showUserList, setShowUserList] = useState(false); // Controls visibility of the new chat user list
  const [typingUsers, setTypingUsers] = useState([]); // List of users currently typing in the active chat
  const [searchQuery, setSearchQuery] = useState(''); // Text for searching chats/users
  const messagesEndRef = useRef(null); // Ref for auto-scrolling messages
  
  const socket = useRef(null); // Use useRef to hold the socket instance
  const [socketConnected, setSocketConnected] = useState(false); // Tracks Socket.io connection status
  const [loading, setLoading] = useState(true); // Loading indicator for initial app setup
  const [error, setError] = useState(null); // Stores any error messages

  // Effect for initial setup: connect socket and fetch users/chats
  useEffect(() => {
    if (currentUser) {
      const initializeApp = async () => {
        setLoading(true);
        setError(null);

        // Initialize Socket.io connection
        if (!socket.current) {
          socket.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            withCredentials: true
          });

          // Socket connection events
          socket.current.on('connect', () => {
            console.log('Socket connected:', socket.current.id);
            setSocketConnected(true);
            socket.current.emit('user_online', currentUser._id);
          });

          socket.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
          });

          socket.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError(`Socket connection failed: ${err.message}`);
            setSocketConnected(false);
          });
        }

        // Fetch initial data (users and chats)
        try {
          const [usersRes, chatsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/getuser`, { withCredentials: true }),
            axios.get(`${API_BASE_URL}/chats`, { withCredentials: true })
          ]);

          const filteredUsers = usersRes.data.userlist2.filter(u => u._id !== currentUser._id);
          setUsers(filteredUsers);

          const sortedChats = chatsRes.data.chats.sort((a, b) => 
            new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0)
          );
          setChats(sortedChats);

          if (sortedChats.length > 0) {
            setActiveChat(sortedChats[0]);
          }
        } catch (err) {
          console.error('Failed to fetch initial data:', err);
          setError('Could not load user data or chats.');
        } finally {
          setLoading(false);
        }
      };

      initializeApp();
    }

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        if (currentUser?._id) {
          socket.current.emit('user_offline', currentUser._id);
        }
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUser]);

  // Effect for fetching messages when active chat changes and joining socket room
  useEffect(() => {
    const fetchMessagesForActiveChat = async () => {
      if (activeChat && currentUser?._id) {
        try {
          const res = await axios.get(`${API_BASE_URL}/messages/${activeChat._id}`, { withCredentials: true });
          setMessages(res.data.messages);

          // Join the specific chat room via socket
          if (socket.current && socketConnected) {
            socket.current.emit('join_chat', activeChat._id);
          }
        } catch (err) {
          console.error('Failed to fetch messages:', err);
          setError('Failed to load messages for this chat.');
          setMessages([]); // Clear messages if fetching fails
        }
      } else {
        setMessages([]); // Clear messages if no active chat
      }
    };
    fetchMessagesForActiveChat();
  }, [activeChat, currentUser, socketConnected]);

  // Effect for Socket.io real-time event listeners
  useEffect(() => {
    if (!socket.current || !currentUser) return; // Ensure socket and currentUser are available

    // Handler for receiving new messages
    const handleReceiveMessage = (message) => {
      console.log('Received message:', message);
      if (activeChat && message.chatId === activeChat._id) {
        setMessages(prev => [...prev, message]);
      }

      // Update chat list with the last message
      setChats(prev => prev.map(chat =>
        chat._id === message.chatId
          ? { ...chat, lastMessage: { content: message.content, sender: message.sender, timestamp: message.timestamp } }
          : chat
      ));
    };

    // Handler for general chat updates (e.g., new chat creation)
    const handleChatUpdated = (updatedChat) => {
      console.log('Chat updated:', updatedChat);
      setChats(prev => {
        const existingIndex = prev.findIndex(chat => chat._id === updatedChat._id);
        if (existingIndex >= 0) {
          const newChats = [...prev];
          newChats[existingIndex] = updatedChat;
          return newChats;
        }
        return [updatedChat, ...prev]; // Add new chat to the top
      });
    };

    // Handler for user typing status
    const handleUserTyping = ({ userId, username }) => {
      if (activeChat && typingUsers.indexOf(username) === -1 && userId !== currentUser._id) {
        setTypingUsers(prev => [...prev, username]);
      }
    };

    // Handler for user stopping typing
    const handleUserStopTyping = ({ userId }) => {
      const user = users.find(u => u._id === userId);
      if (user) {
        setTypingUsers(prev => prev.filter(u => u !== user.username));
      }
    };

    // Handler for user coming online
    const handleUserOnline = (userId) => {
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, isOnline: true } : user
      ));
    };

    // Handler for user going offline
    const handleUserOffline = (userId) => {
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, isOnline: false, lastSeen: new Date() } : user
      ));
    };

    // Register all socket listeners
    socket.current.on('receive_message', handleReceiveMessage);
    socket.current.on('chat_updated', handleChatUpdated);
    socket.current.on('user_typing', handleUserTyping);
    socket.current.on('user_stop_typing', handleUserStopTyping);
    socket.current.on('user_online', handleUserOnline);
    socket.current.on('user_offline', handleUserOffline);

    // Clean up listeners on unmount or dependency change
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
  }, [activeChat, users, currentUser]);

  // Effect to scroll messages to the bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to send a message
  const sendMessage = async () => {
    if (newMessage.trim() && activeChat && currentUser?._id) {
      const messageData = {
        chatId: activeChat._id,
        senderId: currentUser._id,
        content: newMessage,
        messageType: 'text', // Assuming text messages for now
        timestamp: new Date() // Add timestamp for optimistic update
      };

      // Optimistically add message to UI for immediate feedback
      const optimisticMessage = {
        _id: `temp_${Date.now()}`, // Temporary ID for optimistic message
        chatId: activeChat._id,
        sender: currentUser,
        content: newMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage(''); // Clear the input field

      // Update chat's last message optimistically
      setChats(prev => prev.map(chat =>
        chat._id === activeChat._id
          ? { ...chat, lastMessage: { content: newMessage, sender: currentUser, timestamp: new Date() } }
          : chat
      ));

      // Emit message via socket for real-time delivery and backend persistence
      if (socket.current && socketConnected) {
        socket.current.emit('send_message', messageData);
      }

      // Stop typing indicator after sending message
      if (socket.current && socketConnected) {
        socket.current.emit('typing_stop', {
          chatId: activeChat._id,
          userId: currentUser._id
        });
      }
    }
  };

  // Function to start a new chat or open an existing one
  const startNewChat = async (user) => {
    if (!currentUser?._id) {
      setError('Current user not identified. Please log in.');
      return;
    }

    setLoading(true);

    try {
      const existingChat = chats.find(chat => 
        chat.participants.some(p => p._id === user._id) && chat.participants.length === 2
      );

      if (existingChat) {
        setActiveChat(existingChat);
        setShowUserList(false);
      } else {
        const res = await axios.post(`${API_BASE_URL}/chats`, {
          participantIds: [currentUser._id, user._id]
        }, { withCredentials: true });
        
        const newChat = res.data.chat;
        setChats(prev => [newChat, ...prev]);
        setActiveChat(newChat);
        setShowUserList(false);
      }
      setShowUserList(false); // Hide user list
    } catch (err) {
      console.error('Failed to start new chat:', err);
      setError('Failed to create/open chat.');
    } finally {
      setLoading(false);
    }
  };

  // Handle typing in the message input field
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Emit typing events via socket
    if (activeChat && currentUser?._id && socket.current && socketConnected) {
      if (e.target.value.trim()) {
        socket.current.emit('typing_start', {
          chatId: activeChat._id,
          userId: currentUser._id,
          username: currentUser.username
        });
      } else {
        socket.current.emit('typing_stop', {
          chatId: activeChat._id,
          userId: currentUser._id
        });
      }
    }
  };

  // Utility to format time
  const formatTime = (date) => {
    if (!date) return ''; // Handle null/undefined date
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Utility to format last seen status
  const formatLastSeen = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p._id !== currentUser?._id);
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter users for new chat list
  const filteredUsers = users.filter(user =>
    user._id !== currentUser?._id && // Exclude current user
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    // Only show users with whom a chat does NOT already exist
    !chats.some(chat => chat.participants.some(p => p._id === user._id) && chat.participants.some(p => p._id === currentUser?._id))
  );

  // Loading screen
  if (loading || !currentUser) { // Also show loading if currentUser is not yet set
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center font-inter">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">⏳</div>
          <div className="text-xl text-gray-600">Loading WhatsApp...</div>
          {error && <p className="text-red-600 mt-2 text-sm font-semibold">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-inter antialiased">
      {/* Error Message Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-md z-50">
          {error}
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="absolute top-4 left-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm shadow-sm ${
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

      {/* Sidebar - Chat List / New Chat User List */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-300 flex flex-col rounded-l-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 font-medium">
                {currentUser?.username}
              </div>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="More options or start new chat"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              aria-label="Search chats or start new chat"
            />
          </div>
        </div>

        {/* Chat List / New User List Area */}
        <div className="flex-1 overflow-y-auto">
          {showUserList && (
            <div className="border-b border-gray-200">
              <div className="p-3 bg-green-50 text-green-700 text-sm font-medium">
                Start new conversation
              </div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => startNewChat(user)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3 transition-colors rounded-md mx-2 my-1"
                  >
                    <div className="relative">
                      <span className="text-2xl">{user.avatar || '👤'}</span>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No new users available or matching your search.
                </div>
              )}
            </div>
          )}

          {filteredChats.length > 0 ? (
            filteredChats.map(chat => {
              const otherUser = chat.participants.find(p => p._id !== currentUser._id);
              if (!otherUser) return null;

              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3 transition-colors rounded-md mx-2 my-1 ${
                    activeChat?._id === chat._id ? 'bg-green-50 shadow-inner' : ''
                  }`}
                >
                  <div className="relative">
                    <span className="text-2xl">{otherUser.avatar || '👤'}</span>
                    {otherUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">
                        {otherUser.username}
                      </div>
                      {chat.lastMessage && (
                        <div className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.timestamp)}
                        </div>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <div className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.sender?._id === currentUser._id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? "No chats matching your search." : "No active chats. Start a new conversation!"}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Displays active chat messages or a welcome screen */}
      <div className="flex-1 flex flex-col bg-gray-50 rounded-r-lg shadow-lg overflow-hidden">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 shadow-sm z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {activeChat.participants.find(p => p._id !== currentUser._id)?.avatar || '👤'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {activeChat.participants.find(p => p._id !== currentUser._id)?.username || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeChat.participants.find(p => p._id !== currentUser._id)?.isOnline
                        ? <span className="text-green-600">Online</span>
                        : `Last seen ${formatLastSeen(activeChat.participants.find(p => p._id !== currentUser._id)?.lastSeen)}`
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Voice call">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Video call">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Chat options">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 bg-[url('https://placehold.co/800x600/f0f0f0/cccccc?text=Chat+Background')] bg-cover bg-center">
              {messages.map(message => {
                const isOwn = message.sender._id === currentUser._id;
                return (
                  <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md relative group ${
                      isOwn
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}>
                      <div className="text-sm break-words">{message.content}</div>
                      <div className={`text-xs mt-1 text-right ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 animate-pulse">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-inner z-10">
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Attach file">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 pr-12 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    aria-label="Type your message"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Emoji picker">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Welcome screen when no chat is active
          <div className="flex-1 flex items-center justify-center bg-gray-50 bg-[url('https://placehold.co/800x600/f0f0f0/cccccc?text=WhatsApp+Web')] bg-cover bg-center">
            <div className="text-center p-4 bg-white bg-opacity-90 rounded-lg shadow-xl border border-gray-200">
              <div className="text-6xl mb-4 animate-bounce">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">WhatsApp Web</h2>
              <p className="text-gray-500">Select a chat to start messaging</p>
              {error && (
                <p className="text-red-600 mt-2 text-sm font-semibold">
                  Error: {error}
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