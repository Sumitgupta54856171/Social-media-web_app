import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Authcontext } from '../context';
// Custom Message Box component (replaces alert/confirm)
const MessageBox = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p className="text-lg text-gray-800 text-center mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  
  const {search, searchdata} = useContext(Authcontext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const closeMessageBox = () => {
    setShowMessage(false);
    setMessageText('');
  };
const handleclick =async(e)=>{
const response = await axios.post('http://localhost:3003/api/following',{id:userProfile._id},{withCredentials:true})
console.log("follower the user")
console.log(response)
}
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setMessageText('Please enter a username to search.');
      setShowMessage(true);
      return;
    }

    setIsSearching(true);
    setMessageText(`Searching for user: "${searchQuery.trim()}"...`);
    setShowMessage(true);

    try {
      const result = await search(searchQuery.trim());
      if (result) {
        setMessageText(`User "${searchQuery.trim()}" found!`);
      } else {
        setMessageText(`User "${searchQuery.trim()}" not found.`);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setMessageText(`An error occurred during search: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Get the first search result if available
  const profileData = searchdata?.[0];
  const userProfile = profileData;

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden p-6 sm:p-8 lg:p-12">
          {/* Search Bar in No Profile State */}
          <div className="flex items-center space-x-4 mb-8">
            <input
              type="text"
              placeholder="Search for users..."
              className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              disabled={isSearching}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition"
              disabled={!searchQuery.trim() || isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          <p className="text-xl text-gray-600">Search for a user to view their profile.</p>
        </div>
        {showMessage && <MessageBox message={messageText} onClose={closeMessageBox} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden p-6 sm:p-8 lg:p-12">

        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-8">
          <input
            type="text"
            placeholder="Search for users..."
            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition"
            
          >
            Search
          </button>
        </div>

        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12 mb-10 border-b pb-8 border-gray-200">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <img
              src={`https://placehold.co/150x150/FF5A5F/ffffff?text=${userProfile.username.charAt(0).toUpperCase()}`}
              alt={`${userProfile.username}'s profile`}
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* User Info and Stats */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                {userProfile.username}
              </h1>
              <button className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full text-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleclick}>
                Follow
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-8 mb-6">
              <div className="text-center">
                {/* Ensure userProfile.post exists before accessing length */}
                <span className="block text-2xl font-bold text-gray-800">{userProfile.post ? userProfile.post.length : 0}</span>
                <span className="text-gray-600 text-base">Posts</span>
              </div>
              <div className="text-center">
                {/* Ensure userProfile.followers exists before accessing length */}
                <span className="block text-2xl font-bold text-gray-800">{userProfile.followers ? userProfile.followers.length : 0}</span>
                <span className="text-gray-600 text-base">Followers</span>
              </div>
              <div className="text-center">
                {/* Ensure userProfile.following exists before accessing length */}
                <span className="block text-2xl font-bold text-gray-800">{userProfile.following ? userProfile.following.length : 0}</span>
                <span className="text-gray-600 text-base">Following</span>
              </div>
            </div>

            {/* Bio and Email */}
            <p className="text-lg text-gray-700 mb-2 max-w-prose mx-auto md:mx-0">
              {userProfile.bio || 'No bio yet.'}
            </p>
            <p className="text-md text-gray-500 flex items-center justify-center md:justify-start">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              {userProfile.email}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Simplified) */}
        <div className="flex justify-center space-x-12 mb-8 text-gray-600 border-b border-gray-200">
          <button className="flex items-center space-x-2 py-3 border-b-2 border-blue-500 text-blue-500 font-semibold text-lg hover:text-blue-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4V5h-2a1 1 0 100 2h2v3l-4 4-4-4-4 4z" clipRule="evenodd"></path></svg>
            <span>Posts</span>
          </button>
          {/* You can add more tabs like 'Saved', 'Tagged', etc. */}
        </div>

        {/* User Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Render posts only if userProfile.post exists and has elements */}
          {userProfile.post && userProfile.post.length > 0 ? (
            userProfile.post.map((post) => (
              <div key={post.id} className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer transform hover:scale-105 transition-transform duration-300">
                <img
                  src={`http://localhost:3003/uploads/${post.image.name}`}
                  alt={post.caption}
                  className="w-full h-64 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e0e0e0/000000?text=Image+Error'; }}
                />
                {/* Optional overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-center text-sm p-2 truncate">{post.caption}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No posts to display yet.
            </div>
          )}
        </div>
      </div>
      {showMessage && <MessageBox message={messageText} onClose={closeMessageBox} />}
    </div>
  );
};

export default ProfilePage;
