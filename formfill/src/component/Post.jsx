import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Camera, Mic } from 'lucide-react';

  const Post = () => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(1247);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'sarah_johnson',
      text: 'This is absolutely stunning! The composition is perfect 🔥',
      time: '2h',
      likes: 12,
      liked: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      username: 'photography_pro',
      text: 'Love the lighting here! What camera did you use?',
      time: '1h',
      likes: 8,
      liked: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      username: 'art_lover_2024',
      text: 'The colors are so vibrant! This deserves to be in a gallery 🎨',
      time: '45m',
      likes: 23,
      liked: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentLike = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        username: 'you',
        text: newComment,
        time: 'now',
        likes: 0,
        liked: false,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" 
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gradient-to-r from-pink-500 to-purple-500 ring-offset-2"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">alex_photographer</h3>
            <p className="text-xs text-gray-500">New York, NY</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative group">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop" 
          alt="Post content"
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`p-2 rounded-full transition-all duration-200 ${
                liked 
                  ? 'text-red-500 bg-red-50 scale-110' 
                  : 'text-gray-700 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200 hover:scale-105">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-full transition-all duration-200 ${
              saved 
                ? 'text-gray-900 bg-gray-100' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <p className="font-semibold text-gray-900">
            {likeCount.toLocaleString()} likes
          </p>
        </div>

        {/* Caption */}
        <div className="mb-3">
          <p className="text-gray-900">
            <span className="font-semibold">alex_photographer</span> 
            <span className="ml-2">Golden hour magic at the mountains 🌅 There's something truly special about watching the world wake up from this perspective. The silence, the colors, the pure serenity - moments like these remind me why I fell in love with photography.</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">#photography #mountains #goldenhour #nature</p>
        </div>

        {/* View all comments */}
        <button 
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500 text-sm mb-3 hover:text-gray-700 transition-colors"
        >
          {showComments ? 'Hide comments' : `View all ${comments.length} comments`}
        </button>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 group">
                <img 
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900">{comment.username}</span>
                    <span className="ml-2 text-gray-900">{comment.text}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{comment.time}</span>
                    {comment.likes > 0 && (
                      <span className="text-xs text-gray-500">{comment.likes} likes</span>
                    )}
                    <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleCommentLike(comment.id)}
                  className={`p-1 transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                    comment.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          {newComment.trim() && (
            <button 
              onClick={handleAddComment}
              className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors"
            >
              Post
            </button>
          )}
        </div>

        {/* Post time */}
        <p className="text-xs text-gray-400 mt-3">3 hours ago</p>
      </div>
    </div>
  );
};

export default Post;