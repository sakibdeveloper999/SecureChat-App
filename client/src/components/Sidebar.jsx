import React, { useContext, useState, useRef, useEffect } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from "../../context/chat-context"; 


const Sidebar = () => {
  // Destructure the new function 'markMessagesAsSeen' from context
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser,
    unseenMessages,
    markMessagesAsSeen, // <-- Added this
  } = useContext(ChatContext);

  const { logout, onlineUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuAction = (action) => {
    setIsMenuOpen(false);
    action();
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUser]);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* --- Top Section: Logo, Menu, Search --- */}
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-60' />
          <div className='relative py-2' ref={menuRef}>
            <div 
              className={`cursor-pointer h-10 w-10 p-3 z-30 rounded-md transition-colors duration-200 flex items-center justify-center ${isMenuOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}
              onClick={toggleMenu}
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            {isMenuOpen && (
              <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100'>
                <p onClick={() => handleMenuAction(() => navigate('/profile'))} className='cursor-pointer text-sm hover:text-white'>
                  Edit Profile
                </p>
                <hr className='my-2 border-t border-gray-500' />
                <p onClick={handleLogoutClick} className='cursor-pointer text-sm hover:text-white'>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
        <div className='bg-[#282142] rounded-full mt-5 flex items-center gap-2 px-4 py-3'>
          <img src={assets.search_icon} alt="" className='w-3' />
          <input 
            type="text" 
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' 
            placeholder='Search User....'
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* --- User List Section --- */}
      <div className='flex flex-col'>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            // ✅ **FIX 1: Get the count for this user safely.**
            const count = unseenMessages?.[user._id];

            // ✅ **FIX 2: Create a handler to manage user selection and mark messages as seen.**
            const handleUserClick = () => {
              setSelectedUser(user);
              if (count > 0) {
                markMessagesAsSeen(user._id);
              }
            };

            return (
              <div 
                onClick={handleUserClick} // Use the new click handler
                key={user._id} 
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]' : ''}`}
              >
                <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-square rounded-full' />
                <div className='flex flex-col leading-5'>
                  <p>{user.fullName}</p>
                  {onlineUser?.includes(user._id) 
                    ? <span className='text-green-400 text-xs'>Online</span>
                    : <span className='text-xs text-neutral-400'>Offline</span>
                  }
                </div>
                
                {/* ✅ **FIX 3: Use the safe 'count' variable to render the badge.** */}
                {count > 0 && (
                  <span className='absolute top-4 right-4 text-[10px] min-w-[20px] h-5 px-1 flex justify-center items-center rounded-full bg-violet-500 text-white font-bold'>
                    {count}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className='text-center text-gray-400 text-sm py-4'>
            {searchQuery ? 'No users found' : 'No users available'}
          </div>
        )}
      </div>

      {/* --- Logout Confirmation Dialog --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282142] rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-600">
            <h3 className="text-white text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-300 text-sm mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleLogoutCancel} className="px-4 py-2 text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md">No</button>
              <button onClick={handleLogoutConfirm} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-md">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;