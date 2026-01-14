import React, { useState, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';

const WhatsAppStatus = () => {
  const [statuses, setStatuses] = useState([
    {
      id: 1,
      name: 'My Status',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      time: 'Tap to add status update',
      isOwn: true,
      hasStatus: false,
      viewCount: 0,
      stories: []
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      time: '12 minutes ago',
      isOwn: false,
      hasStatus: true,
      viewCount: 23,
      stories: [
        { type: 'text', content: 'Having a great day! ☀️', bg: 'bg-gradient-to-r from-pink-500 to-orange-500' },
        { type: 'image', content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop' }
      ]
    },
    {
      id: 3,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      time: '45 minutes ago',
      isOwn: false,
      hasStatus: true,
      viewCount: 15,
      stories: [
        { type: 'text', content: 'Coffee time! ☕', bg: 'bg-gradient-to-r from-brown-600 to-amber-600' }
      ]
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      time: '2 hours ago',
      isOwn: false,
      hasStatus: true,
      viewCount: 8,
      stories: [
        { type: 'image', content: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop' }
      ]
    },
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      time: '3 hours ago',
      isOwn: false,
      hasStatus: true,
      viewCount: 32,
      stories: [
        { type: 'text', content: 'Weekend vibes! 🎉', bg: 'bg-gradient-to-r from-purple-500 to-blue-500' },
        { type: 'text', content: 'Going out tonight 🌙', bg: 'bg-gradient-to-r from-gray-800 to-gray-900' }
      ]
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!selectedStatus) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentStoryIndex < selectedStatus.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            return 0;
          } else {
            setSelectedStatus(null);
            setCurrentStoryIndex(0);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [selectedStatus, currentStoryIndex]);

  const openStatus = (status) => {
    if (status.isOwn && !status.hasStatus) {
      // Handle add status functionality
      console.log('Add new status');
      return;
    }
    if (status.hasStatus) {
      setSelectedStatus(status);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  };

  const closeStatus = () => {
    setSelectedStatus(null);
    setCurrentStoryIndex(0);
    setProgress(0);
  };

  const getStatusRing = (status) => {
    if (status.isOwn && !status.hasStatus) {
      return 'ring-2 ring-gray-300';
    }
    return status.hasStatus ? 'ring-2 ring-green-500' : 'ring-2 ring-gray-300';
  };

  return (
    <div className="bg-white">
      {/* Status List */}
      <div className="px-4 py-2">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>
        <div className="space-y-3 flex ">
          {statuses.map((status) => (
            <div 
              key={status.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => openStatus(status)}
            >
              {/* Avatar with Status Ring */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full p-0.5 ${getStatusRing(status)}`}>
                  <img 
                    src={status.avatar} 
                    alt={status.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {status.isOwn && !status.hasStatus && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Status Info */}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{status.name}</p>
                <p className="text-sm text-gray-500">{status.time}</p>
              </div>

             
            </div>
          ))}
        </div>
      </div>

      {/* Status Viewer Modal */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Progress Bars */}
          <div className="flex space-x-1 p-2">
            {selectedStatus.stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-600 rounded">
                <div 
                  className="h-full bg-white rounded transition-all duration-100"
                  style={{
                    width: index < currentStoryIndex ? '100%' : 
                           index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center space-x-3">
              <img 
                src={selectedStatus.avatar} 
                alt={selectedStatus.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{selectedStatus.name}</p>
                <p className="text-xs text-gray-300">{selectedStatus.time}</p>
              </div>
            </div>
            <button 
              onClick={closeStatus}
              className="text-white text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Story Content */}
          <div className="flex-1 flex items-center justify-center relative">
            {selectedStatus.stories[currentStoryIndex]?.type === 'text' ? (
              <div className={`w-full h-full flex items-center justify-center ${selectedStatus.stories[currentStoryIndex].bg}`}>
                <p className="text-white text-2xl font-medium text-center px-8">
                  {selectedStatus.stories[currentStoryIndex].content}
                </p>
              </div>
            ) : (
              <img 
                src={selectedStatus.stories[currentStoryIndex]?.content} 
                alt="Status"
                className="w-full h-full object-contain"
              />
            )}

            {/* Navigation Areas */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={() => {
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(prev => prev - 1);
                    setProgress(0);
                  }
                }}
              />
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={() => {
                  if (currentStoryIndex < selectedStatus.stories.length - 1) {
                    setCurrentStoryIndex(prev => prev + 1);
                    setProgress(0);
                  } else {
                    closeStatus();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppStatus;