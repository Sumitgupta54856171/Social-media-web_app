import { useContext } from "react";
import { Authcontext } from "../context";
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { ChevronLeft, X, Heart, MessageCircle, Share } from 'lucide-react';

const Showstatus = () => {
  const { status, handleStatus } = useContext(Authcontext);
  const statusData = status;

  const stories = statusData.map((status) => ({
    id: status._id,
    user: {
      name: status.username,
      avatar: `http://localhost:3003/uploads/${status.name}`
    },
    content: {
      type: "image",
      url: `/${status.image.name}`,
      imageName: status.image.name
    },
    timestamp: "Recently"
  }));

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState({});

  // Ref to store the interval ID
  const intervalRef = useRef(null);
  // State to store the time when the current story started playing (or resumed)
  const [storyStartTime, setStoryStartTime] = useState(Date.now());
  // State to store the progress when paused
  const [pausedProgress, setPausedProgress] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const storyDuration = 30000; // 30 seconds

  useEffect(() => {
    // Clear any existing interval when dependencies change or component unmounts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPaused) {
      // If paused, just stop the interval and do nothing else
      return;
    }

    // When a new story starts or resumes, set the start time
    // If resuming, it should be the current time minus the progress already made
    const startProgressTime = Date.now() - (pausedProgress / 100) * storyDuration;
    setStoryStartTime(startProgressTime);


    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startProgressTime;
      let newProgress = (elapsedTime / storyDuration) * 100;

      if (newProgress >= 100) {
        if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex(prevIndex => prevIndex + 1);
          setProgress(0); // Reset progress for the new story
          setPausedProgress(0); // Reset paused progress for the new story
          setStoryStartTime(Date.now()); // Set start time for the next story
        } else {
          // All stories played, stop the interval and set progress to 100
          clearInterval(intervalRef.current);
          setProgress(100);
          setIsPaused(true); // Optionally pause when all stories are done
          setPausedProgress(100);
        }
      } else {
        setProgress(newProgress);
      }
    }, 100); // Update every 100ms for smoother progress bar

    return () => clearInterval(intervalRef.current); // Cleanup on unmount or re-render
  }, [currentStoryIndex, isPaused, stories.length, pausedProgress]); // Add pausedProgress to dependencies

  // Effect to reset progress and start time when currentStoryIndex changes
  useEffect(() => {
    setProgress(0);
    setPausedProgress(0); // Ensure pausedProgress is reset for new stories
    setStoryStartTime(Date.now()); // New story, new start time
  }, [currentStoryIndex]);


  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
      setPausedProgress(0); // Reset paused progress
      setIsPaused(false); // Ensure it plays automatically
    } else {
      // Optionally handle end of stories, e.g., close the viewer
      handleStatus();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
      setPausedProgress(0); // Reset paused progress
      setIsPaused(false); // Ensure it plays automatically
    }
  };

  const handleTouchStart = (e) => {
    // Pause on touch to allow interaction
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const touchX = e.changedTouches[0].clientX;
    const screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2) {
      goToPrevStory();
    } else {
      goToNextStory();
    }
    // Resume after interaction
    setIsPaused(false);
  };


  const togglePause = () => {
    if (!isPaused) {
      // If currently playing, pause and record current progress
      setPausedProgress(progress);
    }
    // Toggle the pause state
    setIsPaused(prev => !prev);
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
            src={currentStory.user.avatar} // Use currentStory.user.avatar
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

      {/* Story content */}
      <div
        className="relative w-full h-screen"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd} // Changed to onTouchEnd for navigation
        onClick={togglePause} // Click to pause/resume
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
            <>
            {currentStory.content.imageName.map((image)=>{
              <img
                src={`http://localhost:3003/uploads/${image.name}`} // Use imageName
                alt="Story"
                className="w-full h-full object-contain" // Use object-contain to prevent cropping
                onError={() => handleImageError(currentStory.id)}
                onLoad={() => handleImageLoad(currentStory.id)}
              />
            })}
            </>
          )}
        </div>

        {/* These divs are for navigation on touch/click, keeping them separate from togglePause */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full" onClick={goToPrevStory} />
          <div className="w-1/2 h-full" onClick={goToNextStory} />
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

      {/* Story count indicator */}
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

export default Showstatus;