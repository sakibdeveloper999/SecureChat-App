import React, { useState, useContext, useEffect } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ChatContext } from '../../context/chat-context.js'; // ✅ correct


const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext); // Get logout here once
  const [msgImages, setMsgImages] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // 1. Safely handle the 'messages' array
    setMsgImages(
      (messages || []).filter(msg => msg.image).map(msg => msg.image)
    );
  }, [messages]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // The component only renders if a user is selected
  if (!selectedUser) {
    return null; 
  }

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="Profile" className='w-20 aspect-square rounded-full' />
        <h1 className='px-5 text-xl font-medium mx-auto flex items-center gap-2'>
          {/* 2. Safely check the 'onlineUsers' array */}
          {(onlineUsers || []).includes(selectedUser._id) && (
            <p className='w-2 h-2 rounded-full bg-green-500'></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className='px-5 m-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4' />
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, index) => (
            // 3. Use a more stable key than just the index
            <div key={`${url}-${index}`} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} className='h-full w-full object-cover rounded-md' alt="Media content" />
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={handleLogoutClick} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282142] rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-600">
            <h3 className="text-white text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleLogoutCancel} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md">
                No
              </button>
              <button onClick={handleLogoutConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;