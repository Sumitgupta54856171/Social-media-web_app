import React, { useState } from 'react';
import axios from 'axios';
const AddPost = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleSharePost = (e) => {
    e.preventDefault();
    console.log(selectedFile)
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', caption);
    const response = axios.post('http://localhost:3003/api/poststatus',formData,{withCredentials: true})
    setSelectedFile(null);
    setFilePreview(null);
    setCaption('');
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
          <button
            onClick={handleSharePost}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile}
          >
            Share
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[250px] md:min-h-[400px]">
            {filePreview ? (
              <img src={filePreview} alt="Selected Preview" className="max-w-full max-h-96 object-contain rounded-lg" />
            ) : (
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 px-6 py-3 rounded-full font-semibold flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Select Photo/Video
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
              </label>
            )}
            {selectedFile && (
              <button
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                className="mt-4 text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Remove selected file
              </button>
            )}
          </div>
          <div className="flex-1 flex flex-col space-y-4">

            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <textarea
                id="caption"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
