// context/ChatContext.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./chat-context";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext) || {};

  // Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data?.users || []);
      setUnseenMessages(data?.unseenMessages || {});
    } catch (error) {
      toast.error(error?.message || "Failed to fetch users");
    }
  };

  // Get messages for a user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data?.success) {
        setMessages(data.messages || []);

        // Clear unseen count for this user
        setUnseenMessages((prev) => {
          const newUnseen = { ...prev };
          delete newUnseen[userId];
          return newUnseen;
        });
      } else {
        toast.error(data?.message || "Failed to load messages");
      }
    } catch (error) {
      toast.error(error?.message || "Error fetching messages");
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data?.success) {
        setMessages((prev) => [...(prev || []), data.newMessage]);
      } else {
        toast.error(data?.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(error?.message || "Error sending message");
    }
  };

  // Real-time listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Add message to current chat
        newMessage.seen = true;
        setMessages((prev) => [...(prev || []), newMessage]);

        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        // Increment unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
