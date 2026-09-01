import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (backendUrl) {
    axios.defaults.baseURL = backendUrl;
} else {
    console.warn("VITE_BACKEND_URL is not set. API requests may fail.");
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    const connectSocket = useCallback((userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl || window.location.origin, {
            query: { userId: userData._id },
        });

        setSocket(newSocket);
        newSocket.on("getOnlineUsers", setOnlineUser);
    }, [socket]);

    const checkAuth = useCallback(async () => {
        if (!token) return;

        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common.token;
            setToken(null);
            setAuthUser(null);
        }
    }, [connectSocket, token]);

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (!data.success) {
                toast.error(data.message || "Authentication failed");
                return false;
            }

            axios.defaults.headers.common.token = data.token;
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setAuthUser(data.userData);
            connectSocket(data.userData);
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to authenticate. Please try again.");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common.token;
        socket?.disconnect();
        setSocket(null);
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        toast.success("Logged out successfully");
    };

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return true;
            }

            toast.error(data.message || "Unable to update profile");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update profile");
        }

        return false;
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common.token = token;
            checkAuth();
        }
    }, [token, checkAuth]);

    const value = {
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};