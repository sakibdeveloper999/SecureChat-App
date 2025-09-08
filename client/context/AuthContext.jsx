import { createContext, useCallback, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (backendUrl) {
    axios.defaults.baseURL = backendUrl;
} else {
    // Provide a clear signal if the backend URL isn't configured
    console.warn("VITE_BACKEND_URL is not set. API requests may fail.");
}


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    // Connect Socket Function to handle socket connection and online users updates 
    const connectSocket = useCallback((userData)=>{
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl || window.location.origin,{
            query:{
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUser(userIds);
        })
    }, [socket]);

    // Check if user is authenticated and if so, set the user data and connect the socket 
    const checkAuth = useCallback(async()=>{
        try{
            const {data}= await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch(error){
            toast.error(error.message)
        }
    }, [connectSocket]);

    // Login function to handle user authentication and socket connection 
    const login = async(state, credential)=>{
        try{
            const {data} =await axios.post(`/api/auth/${state}`, credential)
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    // Logout function to handle user logout and socket disconnection

    const logout = async ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"]= null;
        toast.success("Logged out Successfully")
        socket?.disconnect();
    }

    // Updata profile function to handle user profile updates

    const updateProfile = async (body)=>{
        try{
            const {data}= await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        }catch(error){
            toast.error(error.message)

        }
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[token, checkAuth])
    const value ={
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}