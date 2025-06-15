import React, { useEffect, useState, useContext } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import axios from 'axios';
import { Authcontext } from "../context";
const Post = () => {
  const [posts, setPosts] = useState([]);
  const { username } = useContext(Authcontext); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/getpost', { withCredentials: true });
        const postsWithUserDetails = response.data.statusdata1.map(post => ({
          ...post,
          user: {
            name: username.username || 'Anonymous',
            avatar: response.data.proimage?.path ? `http://localhost:3003/${response.data.proimage.path}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }
        }));
        setPosts(postsWithUserDetails.reverse()); 
        console.log('posts',posts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    console.log(`Liking post ${postId}`);
  };

  const handleComment = (postId, comment) => {
    console.log(`Adding comment to post ${postId}:`, comment);
  };

  return (
    
    <div className="bg-gray-100 min-h-screen text-gray-800 flex justify-center py-4 sm:py-8">
      <div className="w-full max-w-lg md:max-w-2xl space-y-6 md:space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLike} onComment={handleComment} />
          ))
        ) : (
          <p className="text-center text-gray-400">No posts to show.</p>
        )}
      </div>
    </div>
  );
};

const PostCard = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLikeClick = () => {
    setLiked(!liked);
    onLike(post._id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post._id, newComment);
      setNewComment('');
    }
  };

  return (
    <>

    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center p-4">
        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
        <p className="ml-4 font-semibold text-gray-800">{post.user.name}</p>
        <button className="ml-auto text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <img src={`http://localhost:3003/uploads/${post.image.name}`} alt={post.title} className="w-full h-auto object-cover" />

      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4">
          <button onClick={handleLikeClick} className={`${liked ? 'text-red-500' : 'text-gray-700'} hover:text-red-500 transition-colors`}>
            <Heart size={28} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button className="text-gray-700 hover:text-gray-900">
            <MessageCircle size={28} />
          </button>
          <button className="text-gray-700 hover:text-gray-900">
            <Send size={28} />
          </button>
        </div>
        <button className="text-gray-700 hover:text-gray-900">
          <Bookmark size={28} />
        </button>
      </div>

      <div className="px-4 pb-2">
        <p className="font-semibold text-gray-800">{post.like} likes</p>
        <p className="text-gray-800"><span className="font-semibold mr-2">{post.user.name}</span>{post.title}</p>
      </div>

      <div className="px-4 pb-2 text-gray-500">
        {post.Comments.length > 0 && (
          <p>View all {post.Comments.length} comments</p>
        )}
        {post.Comments.slice(0, 2).map((comment, index) => (
          <p key={index}><span className="font-semibold text-gray-800 mr-2">user</span>{comment}</p>
        ))}
      </div>

      <form onSubmit={handleCommentSubmit} className="flex items-center p-4 border-t border-gray-200">
        <Smile size={24} />
        <input 
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent mx-4 outline-none text-gray-800 placeholder-gray-400"
        />
        <button type="submit" className="font-bold text-blue-500 disabled:text-blue-300/50" disabled={!newComment.trim()}>
          Post
        </button>
      </form>
    </div>
    </>
  );
};

export default Post;