import { useContext } from "react";
import { Authcontext } from "../context";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Heart, MessageCircle, Share } from 'lucide-react';

const Showpost = () => {
  // Sample data based on your database structure
  const {status,handleStatus} =useContext(Authcontext);
  const statusData = status;

  // Transform your data to stories format
  const stories = statusData.map((status) => ({
    id: status._id,
    user: {
      name: status.title,
      avatar: `http://localhost:3003/uploads/${status.image.name}` // Generate avatar from username
    },
    content: {
      type: "image",
      url: `/${status.image.name}`, // Your image path
      imageName: status.image.name
    },
    timestamp: "Recently" // You can add timestamp field to your database
  }));

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const currentStory = stories[currentStoryIndex];
  const storyDuration = 10000;

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  // Handle touch events for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const diff = touchStart - touchEnd;
    const swipeThreshold = 50; // Minimum distance to trigger swipe
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - go to next story
        goToNextStory();
      } else {
        // Swipe right - go to previous story
        goToPrevStory();
      }
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            goToNextStory();
            return 0;
          } else {
            return 100;
          }
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, isPaused, stories.length]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleImageError = (storyId) => {
    setImageError(prev => ({ ...prev, [storyId]: true }));
  };

  const handleImageLoad = (storyId) => {
    setImageError(prev => ({ ...prev, [storyId]: false }));
  };

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentStoryIndex ? '100%' : 
                       index === currentStoryIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6 text-white cursor-pointer" />
          <img 
            src={currentStory.user.avatar} 
            alt={currentStory.user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold text-sm capitalize">{currentStory.user.name}</p>
            <p className="text-gray-300 text-xs">{currentStory.timestamp}</p>
          </div>
        </div>
        <X className="w-6 h-6 text-white cursor-pointer" onClick={handleStatus}></X>
      </div>

      {/* Add a dedicated pause/unpause button */}
      <button 
        onClick={togglePause} 
        className="fixed bottom-24 right-4 z-40 bg-black/70 text-white rounded-full p-3 shadow-lg hover:bg-black/90 transition"
        aria-label={isPaused ? "Resume story" : "Pause story"}
      >
        {isPaused ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4v4h-4zM6 10h4v4H6z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
          </svg>
        )}
      </button>

      <div 
        className="relative w-full h-screen"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          {imageError[currentStory.id] ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white text-lg">Image not available</p>
                <p className="text-gray-400 text-sm mt-2">{currentStory.content.imageName}</p>
              </div>
            </div>
          ) : (
            <img 
              src={`http://localhost:3003/uploads/${currentStory.content.url}`}
              alt="Story"
              className="w-full h-full size-44"
              onError={() => handleImageError(currentStory.id)}
              onLoad={() => handleImageLoad(currentStory.id)}
            />
          )}
        </div>

        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full" />
          <div className="w-1/2 h-full" />
        </div>
      </div>

      {/* Bottom interaction bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 border border-gray-600">
            <input 
              type="text" 
              placeholder={`Reply to ${currentStory.user.name}...`}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
            />
          </div>
          <button className="p-2">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button className="p-2">
            <Share className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

     
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-black/50 rounded-full p-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-white rounded-full"></div>
                <div className="w-1 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-20 right-4 z-20">
        <div className="bg-black/50 rounded-full px-3 py-1">
          <p className="text-white text-xs">
            {currentStoryIndex + 1} / {stories.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Showpost;