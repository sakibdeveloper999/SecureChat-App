import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/chat-context'
import { AuthContext } from '../../context/AuthContext'

const ChatContainer = () => {
  const { messages, setSelectedUser, selectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("")
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Common emojis for the picker
  const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '🙂‍↕️', '😏', '😒', '🙂‍↔️', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😶‍🌫', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫', '🫠', '🤥', '😶', '🫥', '😐', '🫤', '😑', '🫨', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '🫩', '😴', '🤤', '😪', '😮‍💨', '😵', '😵‍💫', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☪️', '❌', '❗️', '‼️', '⁉️', '❔', '❓', '🚳', '🚱', '🔞', '📵', '🚭', '🔅', '🔆', '〽️', '❎', '✅', '❇️', '🕖', '🕛', '🕟', '♥️', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🫶', '🤲', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🫷', '🫸', '🤞', '✌️', '🫰', '🤟', '🤘', '👌', '🤌', '🤏', '🫳', '🫴', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '🫲', '🫱', '💪', '🦾', '🖕', '✍️', '🙏', '🫵', '🦶', '💄', '💋', '👄', '🫦', '👅', '👃', '🫆', '👣', '👀', '👁', '🧠', '🫁', '🫀', '👥', '🫂', '👤', '👶', '👧', '🧒', '👩', '👨', '🧑‍🦰', '👱', '👱‍♂', '🧑‍🦲', '👨‍🦳', '👵', '🧓', '👳', '👳‍♂', '👮‍♀', '👮‍♂', '👷‍♀', '👷‍♂', '💂', '🕵️', '🧑‍⚕', '👨‍🌾', '👨‍🍳', '👨‍🎓', '🧑‍🎤', '👨‍🎤', '🧑‍🏫', '👨‍🏫', '🧑‍🏭', '👨‍🏭', '👩‍💻', '🧑‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '💆', '🙋', '🧚‍♀', '🧚', '👼', '🤰', '🫄', '🫃', '👩‍🍼', '🧑‍🍼', '👨‍🍼', '🙇‍♀', '🙇', '💁‍♀', '💁', '💁‍♂', '🙅‍♀', '🙅', '🙅‍♂', '🙆‍♀', '🙆', '🙆‍♂', '🙋‍♀', '🙋', '🙋‍♂', '🧏‍♀', '🧏', '🧏‍♂', '🤦‍♀', '🤦', '🤦‍♂', '🤷‍♀', '🤷', '🤷‍♂', '🙎‍♀', '🙎', '🙎‍♂', '🙍‍♀', '🙍', '🙍‍♂', '💇‍♀', '💇', '💆‍♀', '💆‍♂', '🧖‍♀', '🧖', '🧖‍♂', '💅', '🤳', '💃', '🕺', '👯‍♀', '🧑‍🦽‍➡️', '👨‍🦼', '🚶‍♀‍➡️', '🚶‍♂‍➡️', '👫', '🏃', '🏃‍♀', '🏃‍♂', '👭', '👩‍❤️‍👨', '👩‍❤️‍👩', '👨‍❤️‍👨', '👩‍❤️‍💋‍👩', '👩‍❤️‍💋‍👨', '👙', '🧥', '🥼', '🦺', '👚', '👕', '👖', '🩲', '🩳', '👔', '👗', '👘', '🥻', '👟', '👞', '👡', '🕶', '👓', '🥽', '👑', '💍', '👜', '🐦‍⬛️', '👓', '🐸', '🐵', '🙉', '🐒', '🙈', '🙊', '☘️', '🍀', '🌱', '🌺', '💐', '🌷', '🍃', '🍂', '🍁', '🌾', '🌞', '🌻', '🌼', '🌺', '🪷', '🌝', '⭐️', '🌟', '💫', '🌏', '🌍', '🌈', '☄️', '🌔', '💥', '🔥', '🌧', '⛈', '🌩', '☃️', '🌤', '☀️', '⛅️', '☁️', '☁️', '🌦', '💦', '💧', '🌬', '⛄️', '☃️', '🫧', '☔️', '☂️', '🌫', '🌊', '🍏', '🍑', '🍒', '🍖', '🧇', '🍔', '🍠', '🥟', '🥪', '🍢', '🍥', '🍨', '🍚', '🍚', '🍩', '🧃', '🌰', '🍸', '🧋', '🥃', '🍶', '🍷', '🥂', '🍸', '🍹', '🧉', '🍾', '🥤', '🥏', '🎂', '🧁', '🍰', '⚽️', '⛳️', '🚣', '🏆', '🚵‍♂', '🥇', '🥈', '🥉', '🏅', '🎖', '🎗', '🎫', '🎟', '🎧', '🎤', '🎬', '🥁', '🎷', '🎷', '🎺', '🪗', '🪕', '🪉', '🎯', '🎳', '🎮', '🎰', '🚕', '🦼', '🚌', '🚠', '🚜', '🚇', '🚨', '🚆', '🚄', '⛵️', '🛬', '🪝', '⛴', '⚓️', '🚢', '🎡', '🛥', '🚧', '🗻', '🏔', '⛰', '🌋', '🏜', '🏝', '🏖', '⛱', '🌠', '🎇', '🌇', '⛩', '🕋', '🏙', '🌃', '🌌', '🗾', '🏞', '🌅', '🌄', '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '📷', '📸', '🎥', '🎞', '📞', '📟', '📠', '📻', '🎚', '🔌', '⏱️', '⏲️', '🕰', '⌛️', '📡', '🔋', '🪫', '💡', '🔦', '🔌', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '🪪', '💎', '⚖️', '🪜', '🧰', '🔧', '🪛', '🔨', '⚒️', '🛠', '🪏', '🔪', '🧨', '⚔️', '🧲', '🔫', '🪦', '⚰️', '🚬', '🔭', '🔬', '🚽', '🗝', '🔑', '🧽', '🎐', '🎈', '🛒', '🎊', '🎉', '🎀', '🪅', '📃', '📑', '🧾', '📊', '📈', '📉', '📆', '📅', '🗑', '🗃', '📕', '📗', '📔', '🗂', '🔗', '🖋', '📋', '📒', '📌', '📍', '✂️', '✒️', '🖍', '📝', '✏️', '🔍', '🔒', '🔏', '🇧🇩', '🏁', '🚩'];


  const handleEmojiClick = (emoji) => {
    setInput(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  return selectedUser ? (
    <div className=" h-full overflow-scroll relative backdrop-blur-lg  ">
      {/*------------------ Header------------------ */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUser?.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 ' />
      </div>
      {/* Chat Messages */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll  pb-6 p-3'>
        {messages?.length > 0 ? messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-[200px]  md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser?._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )}
            <div className='text-center text-xs '>
              <img src={msg.senderId === authUser?._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full ' />
              <p className='text-gray-500 '>{formatMessageTime(msg.createdAt)}</p>
            </div>

          </div>
        )) : (
          <div className='flex items-center justify-center h-full text-gray-400'>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {/* <div ref={scrollEnd}></div> */}
      </div>
      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 p-3  backdrop-transparent ">
        <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-1">

          {/* Text Input */}
          <input

            type="text"
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
            className="flex-1 bg-transparent  text-sm text-white placeholder-gray-400 outline-none border-none"
          />

          {/* File Upload */}
          <input
            onChange={handleFileUpload}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 opacity-80 hover:opacity-100 transition"
            />
          </label>

          {/* Emoji Button */}
          <button
            onClick={toggleEmojiPicker}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <span className="text-lg">😊</span>
          </button>

          {/* Send Button */}
          <button className="p-2 rounded-full hover:bg-white/20 transition">
            <img
              src={assets.send_button}
              alt="Send"
              className="w-6"
              onClick={handleSendMessage}
            />
          </button>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-3 right-3 bg-[#282142] rounded-lg p-4 border border-gray-600 shadow-lg">
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-white/20 rounded p-2 transition-colors duration-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2  text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.chat_contain_img} alt="" className='max-w-40' />
      <p className='text-lg'>Select a user to start chatting</p>
      <p className='pt-10 text-sm '>This Chat-App Develop by <a href="https://sakibdeveloper.com" className='text-violet-400/50'>MD. SAKIB</a></p>
    </div>
  )
}

export default ChatContainer