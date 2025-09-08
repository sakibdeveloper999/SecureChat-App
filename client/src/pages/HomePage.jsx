import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/chat-context'

const HomePage = () => {

    // This is the main layout for the home page, which includes the sidebar, chat container, and right sidebar.
  const {selectedUser}= useContext(ChatContext);
    
  return (
    <div className='border w-full h-screen sm:px-[5%] sm:py-[3%]'>
        {/* The grid layout is now more explicit and conditionally renders the RightSidebar */}
        <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_2fr_1fr]':'md:grid-cols-2'}  `}>

            <Sidebar />
            <ChatContainer/>
            {/* RightSidebar will only be rendered on the screen if a user has been selected */}
            <RightSidebar />

        </div>
    </div>
  )
}

export default HomePage