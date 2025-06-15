import { useContext,useState, useCallback, useRef } from "react";

import { Authcontext } from "../context";


const API_BASE_URL = "http://localhost:3003";
const PLACEHOLDER_AVATAR = (username) => 
  `https://placehold.co/128x128/FF5A5F/ffffff?text=${username?.charAt(0).toUpperCase() || '?'}`;

// Mock API call function - replace with your actual API implementation
const mockApiCall = async (url, options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 1000);
  });
};

// Custom hooks
const useFollowUser = (userId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollow = useCallback(async () => {
    if (!userId || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await mockApiCall(`${API_BASE_URL}/api/following`, {
        method: 'POST',
        body: JSON.stringify({ id: userId }),
        credentials: 'include'
      });
      
      if (response.data.success) {
        setIsFollowing(prev => !prev);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  return { isFollowing, isLoading, toggleFollow };
};

// Component parts
const ProfileAvatar = ({ username, size = "lg" }) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className="relative">
      <img
        src={PLACEHOLDER_AVATAR(username)}
        alt={`${username}'s profile`}
        className={`${sizeClasses[size]} rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-blue-100`}
      />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
    </div>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center group cursor-pointer">
    <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
      {value || 0}
    </div>
    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
      {label}
    </div>
  </div>
);

const FollowButton = ({ onFollow, isLoading, isFollowing }) => (
  <button
    onClick={onFollow}
    disabled={isLoading}
    className={`
      px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 
      ${isFollowing 
        ? 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200' 
        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
      }
      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      focus:outline-none focus:ring-4 focus:ring-blue-200
    `}
  >
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    ) : (
      isFollowing ? 'Following' : 'Follow'
    )}
  </button>
);

const PostGrid = ({ posts }) => {
  if (!posts?.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-sm">Share your first moment!</p>
      </div>
    );
  }

  return posts.map((post) => (
    <div 
      key={post.id} 
      className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={`${API_BASE_URL}/uploads/${post.image?.name}`}
        alt={post.caption || 'Post image'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${API_BASE_URL}/uploads/placeholder.png`;
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium line-clamp-2">
            {post.caption || 'No caption'}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-white/80 text-xs">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

const ShowUserProfile = () => {
    const {searchdata} = useContext(Authcontext);
    const number = useRef(0);
    const id = number.current++;
    
    // Mock data for demo - replace with your actual context
    const mockUserProfile = searchdata;
    
    // In your actual component, uncomment this and remove the mock data above
    // const { searchdata } = useContext(Authcontext);
    // const userProfile = searchdata || {};
    
    const userProfile = mockUserProfile;
    
    const { isFollowing, isLoading, toggleFollow } = useFollowUser(userProfile._id);

  if (!userProfile._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 sm:h-40 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-8 lg:px-12 pb-8 relative">
          
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-6 -mt-16 sm:-mt-20 mb-8">
            <ProfileAvatar username={userProfile.username} />
            
            <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {userProfile.username || 'Unknown User'}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {userProfile.bio || 'No bio available'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FollowButton 
                    onFollow={toggleFollow}
                    isLoading={isLoading}
                    isFollowing={isFollowing}
                  />
                  <button className="p-2.5 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {userProfile.email || 'No email provided'}
              </div>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start space-x-8 sm:space-x-12">
                <StatItem value={userProfile.post?.length} label="Posts" />
                <StatItem value={userProfile.followers?.length} label="Followers" />
                <StatItem value={userProfile.following?.length} label="Following" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex justify-center space-x-8">
              <button className="flex items-center space-x-2 py-4 border-b-2 border-blue-500 text-blue-600 font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Posts</span>
              </button>
            </nav>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <PostGrid posts={userProfile.post} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserProfile;