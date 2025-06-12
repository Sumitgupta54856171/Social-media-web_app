import { useContext } from "react";
import { Authcontext } from "../context";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Heart, MessageCircle, Share } from 'lucide-react';

const Showpost = () => {
  const { status, handleStatus, username } = useContext(Authcontext);

  // Transform data to stories format
  const stories = status.map((s) => ({
    id: s._id,
    user: {
      name: username,
      avatar: `http://localhost:3003/uploads/${s.image.name}`,
    },
    content: {
      type: "image",
      url: s.image.name, // Corrected URL: remove leading slash
      imageName: s.image.name,
    },
    timestamp: "Recently",
  }));

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState({});

  const storyDuration = 10000;

  // Handle empty stories case
  if (!stories || stories.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden flex items-center justify-center text-white">
        <p>No stories available.</p>
        <button onClick={handleStatus} className="absolute top-4 right-4 z-30">
          <X className="w-8 h-8 text-white" />
        </button>
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      handleStatus(); // Close when last story finishes
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (isPaused || imageError[currentStory.id]) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, isPaused, stories.length, imageError]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleImageError = (storyId) => {
    setImageError((prev) => ({ ...prev, [storyId]: true }));
  };

  const handleImageLoad = (storyId) => {
    setImageError((prev) => ({ ...prev, [storyId]: false }));
  };

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative overflow-hidden">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                    ? `${progress}%`
                    : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <button onClick={handleStatus}>
            <ChevronLeft className="w-6 h-6 text-white cursor-pointer" />
          </button>
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
        <button onClick={handleStatus}>
          <X className="w-6 h-6 text-white cursor-pointer" />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="relative w-full h-screen">
        <div className="relative w-full h-full">
          {imageError[currentStory.id] ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <p className="text-white text-lg">Couldn't load story</p>
              </div>
            </div>
          ) : (
            <img
              src={`http://localhost:3003/uploads/${currentStory.content.url}`}
              alt="Story"
              className="w-full h-full object-cover" // Corrected sizing
              onError={() => handleImageError(currentStory.id)}
              onLoad={() => handleImageLoad(currentStory.id)}
            />
          )}
        </div>

        {/* Navigation and Pause/Play overlay */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full" onClick={goToPrevStory} />
          <div className="w-1/3 h-full" onClick={togglePause} />
          <div className="w-1/3 h-full" onClick={goToNextStory} />
        </div>
      </div>

      {/* Bottom interaction bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={`Reply to ${currentStory.user.name}...`}
            className="flex-1 bg-black/30 rounded-full px-4 py-2 text-white placeholder-gray-400 text-sm outline-none border border-gray-600"
          />
          <button className="p-2">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button className="p-2">
            <Share className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-black/50 rounded-full p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showpost;