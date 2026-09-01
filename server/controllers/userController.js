import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

const normalizeEmail = (email) => email?.trim().toLowerCase();

// Sign up a new user
export const signup = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const fullName = req.body.fullName?.trim();
    const password = req.body.password;
    const bio = req.body.bio?.trim();

    try {
        if (!email || !fullName || !password || !bio) {
            return res.status(400).json({ success: false, message: "Email, name, password, and bio are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, message: "An account already exists for this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);
        return res.status(201).json({
            success: true,
            userData: newUser,
            token,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Signup failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to create account" });
    }
};

// Login user
export const login = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const userData = await User.findOne({ email });
        const isPasswordCorrect = userData && await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(userData._id);
        return res.json({ success: true, userData, token, message: "Login successful" });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to log in" });
    }
};

export const checkAuth = async (req, res) => {
    return res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic, { folder: "chat-app" });
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio, profilePic: upload.secure_url },
                { new: true }
            );
        }

        return res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Profile update failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to update profile" });
    }
};