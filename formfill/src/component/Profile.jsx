import { useState,useEffect } from "react"
import axios from "axios"
function Profile(){
    const [profile,setprofile] = useState('')
useEffect(()=>{
    const fetchprofile = async()=>{
        const response = await axios.get('http://localhost:3003/api/getprofile',{withCredentials: true})
        console.log('profile data is fetch')
        console.log(response.data)
        setprofile(response.data.profiledata)
        console.log(profile)
    } 
    fetchprofile();  
},[])

const profileData =profile
const userProfile = profileData[0];

if (!userProfile) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden p-6 sm:p-8 lg:p-12 text-center">
        <p className="text-xl text-gray-600">No profile data available. Please check your data source.</p>
        <p className="text-md text-gray-500 mt-2">
          In a real application, user profile data would be loaded here.
        </p>
      </div>
    </div>
  );
}
return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto overflow-hidden p-4 sm:p-6 lg:p-10">

        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 mb-8 border-b pb-6 border-gray-200">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <img
               src={`https://placehold.co/128x128/FF5A5F/ffffff?text=${userProfile.username.charAt(0).toUpperCase()}`}
              alt={`${userProfile.username}'s profile`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* User Info and Stats */}
          <div className="flex-grow text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {userProfile.username}
              </h1>
              <button className="mt-3 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg text-sm shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 mb-5">
              <div className="text-center">
                {/* Ensure userProfile.post exists before accessing length */}
                <span className="block text-xl sm:text-2xl font-bold text-gray-800">{userProfile.post ? userProfile.post.length : 0}</span>
                <span className="text-gray-600 text-sm sm:text-base">Posts</span>
              </div>
              <div className="text-center">
                {/* Ensure userProfile.followers exists before accessing length */}
                <span className="block text-xl sm:text-2xl font-bold text-gray-800">{userProfile.followers ? userProfile.followers.length : 0}</span>
                <span className="text-gray-600 text-sm sm:text-base">Followers</span>
              </div>
              <div className="text-center">
                {/* Ensure userProfile.following exists before accessing length */}
                <span className="block text-xl sm:text-2xl font-bold text-gray-800">{userProfile.following ? userProfile.following.length : 0}</span>
                <span className="text-gray-600 text-sm sm:text-base">Following</span>
              </div>
            </div>

            {/* Bio and Email */}
            <p className="text-base text-gray-700 mb-2 max-w-prose mx-auto sm:mx-0">
              {userProfile.bio || 'No bio yet.'}
            </p>
            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              {userProfile.email}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Simplified) */}
        <div className="flex justify-center space-x-8 sm:space-x-12 mb-6 sm:mb-8 text-gray-600 border-b border-gray-200">
          <button className="flex items-center space-x-2 py-2 sm:py-3 border-b-2 border-blue-500 text-blue-500 font-semibold text-sm sm:text-base hover:text-blue-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4V5h-2a1 1 0 100 2h2v3l-4 4-4-4-4 4z" clipRule="evenodd"></path></svg>
            <span>Posts</span>
          </button>
          {/* You can add more tabs like 'Saved', 'Tagged', etc. */}
        </div>

        {/* User Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {/* Render posts only if userProfile.post exists and has elements */}
          {userProfile.post && userProfile.post.length > 0 ? (
            userProfile.post.map((post) => (
              <div key={post.id} className="relative aspect-square rounded-md overflow-hidden group cursor-pointer">
                <img
                  src={`http://localhost:3003/uploads/${post.image.name}`}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:3003/uploads/placeholder.png'; }}
                />
                {/* Optional overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-center text-xs sm:text-sm p-2 truncate">{post.caption}</p>
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
    </div>
  );
};

export default Profile