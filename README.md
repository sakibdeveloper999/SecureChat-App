# SecureChat App

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io. This application enables users to communicate securely and instantly with others in the network.

## 📋 Project Overview

SecureChat is a modern chat application that allows users to connect, authenticate, manage their profiles, and exchange messages in real-time. The app features user authentication with JWT tokens, real-time messaging using WebSockets, and a responsive UI built with React and Tailwind CSS.

---

## ✨ Key Features

### Authentication & User Management
- **User Signup**: Register new users with email, full name, password, and bio
- **User Login**: Secure login with email and password authentication
- **Password Security**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Token-based authentication for secure API access
- **Session Persistence**: Tokens stored in localStorage for session management
- **Profile Management**: Edit user profile including name, bio, and profile picture
- **Profile Picture Upload**: Upload and store profile pictures using Cloudinary

### Chat Features
- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Message History**: Retrieve and display chat history between users
- **Text & Image Messages**: Support for both text messages and image attachments
- **Image Upload**: Upload images directly through Cloudinary
- **Message Status**: Track message read/seen status
- **Unseen Message Counts**: Display count of unseen messages per conversation
- **Message Timestamps**: Automatic timestamp recording for all messages

### User Interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Sidebar**: User list with search functionality and online status indicators
- **Chat Container**: Main chat interface with message display and input
- **Right Sidebar**: User profile information and status display
- **Online Status**: Real-time display of which users are online
- **User Search**: Filter and search users by name
- **Navigation**: Smooth routing between Login, Home, and Profile pages

### Real-Time Features
- **Online User Tracking**: See which users are currently online
- **Socket.io Integration**: Real-time bidirectional communication
- **Live Updates**: Messages and user status update instantly across all clients
- **Connection Management**: Automatic socket connection on login, disconnection on logout

---

## 🏗️ Project Architecture

### Client (React Frontend)

#### Directory Structure
```
client/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   ├── pages/
│   │   ├── HomePage.jsx       # Main chat interface
│   │   ├── LoginPage.jsx      # Authentication page
│   │   └── ProfilePage.jsx    # User profile edit page
│   ├── components/
│   │   ├── Sidebar.jsx        # User list sidebar with search
│   │   ├── ChatContainer.jsx  # Main chat display area
│   │   └── RightSidebar.jsx   # User profile information
│   ├── assets/
│   │   └── assets.js          # Asset imports
│   └── lib/
│       └── utils.js           # Utility functions
├── context/
│   ├── AuthContext.jsx        # Authentication state management
│   ├── ChatContext.jsx        # Chat state management
│   └── chat-context.js        # Chat context creation
├── package.json
├── vite.config.js
└── index.html
```

#### Technologies Used
- **React 19.1**: UI framework for building interactive user interfaces
- **Vite**: Modern build tool and development server with fast HMR
- **React Router DOM 7.8**: Client-side routing for seamless navigation
- **Axios 1.11**: HTTP client for API requests with interceptors
- **Socket.io Client 4.8**: Real-time bidirectional communication
- **Tailwind CSS 4.1**: Utility-first CSS framework for responsive styling
- **React Hot Toast 2.6**: Toast notifications for user feedback
- **ESLint**: Code quality and style consistency checking

#### Context Management

**AuthContext.jsx**
- Manages user authentication state
- Handles signup/login/logout operations
- Manages JWT tokens and local storage
- Initializes and manages Socket.io connection
- Tracks online users list
- Provides `login()`, `logout()`, `updateProfile()`, and `connectSocket()` methods

**ChatContext.jsx**
- Manages chat state (messages, users, selected user)
- Handles message fetching and sending
- Tracks unseen message counts
- Listens for real-time messages via Socket.io
- Provides `getUsers()`, `getMessages()`, `sendMessage()` methods
- Manages user selection for conversations

#### Pages

**HomePage.jsx**
- Main chat interface
- Displays Sidebar, ChatContainer, and RightSidebar
- Responsive layout that adapts to screen size
- Shows RightSidebar only when a user is selected

**LoginPage.jsx**
- Dual-mode form (Sign Up / Login)
- Two-step signup process (credentials → bio)
- Form validation
- Handles both signup and login with context methods
- Brand information and logo display

**ProfilePage.jsx**
- User profile editing interface
- Update name and bio
- Upload and change profile picture
- Image preview before upload
- Navigate back to home after saving

#### Components

**Sidebar.jsx**
- Displays list of all users
- User search functionality
- Shows online/offline status
- Displays unseen message count badges
- Hamburger menu with profile and logout options
- Logout confirmation dialog

**ChatContainer.jsx**
- Main message display area
- Shows message history with sender information
- Message input area with text and image support
- Image preview before sending
- Scrolls to latest messages

**RightSidebar.jsx**
- Shows selected user's profile information
- Displays user's profile picture and bio
- Shows online/offline status
- Only visible when a user is selected

### Server (Node.js Backend)

#### Directory Structure
```
server/
├── server.js                      # Express server setup & Socket.io
├── package.json
├── controllers/
│   ├── userController.js         # User signup, login, auth check, profile update
│   └── messageController.js      # Message operations (send, fetch, mark as seen)
├── models/
│   ├── User.js                   # User schema
│   └── Message.js                # Message schema
├── routes/
│   ├── userRoutes.js            # Auth endpoints
│   └── messageRoutes.js         # Message endpoints
├── middleware/
│   └── auth.js                  # JWT authentication middleware
└── lib/
    ├── db.js                    # MongoDB connection
    ├── cloudinary.js            # Cloudinary configuration
    └── utils.js                 # Utility functions (JWT token generation)
```

#### Technologies Used
- **Express 5.1**: Web framework
- **MongoDB/Mongoose 8.18**: Database and ODM
- **Socket.io 4.8**: Real-time communication
- **JWT (jsonwebtoken 9.0)**: Token-based authentication
- **Bcryptjs 3.0**: Password hashing
- **Cloudinary 2.7**: Image storage and CDN
- **CORS 2.8**: Cross-origin resource sharing
- **Dotenv 17.2**: Environment variable management
- **Nodemon 3.1**: Development server auto-reload

#### API Endpoints

**Authentication Routes** (`/api/auth`)
- `POST /signup` - Register new user
  - Body: `{ email, fullName, password, bio }`
  - Returns: `{ success, userData, token, message }`

- `POST /login` - Authenticate user
  - Body: `{ email, password }`
  - Returns: `{ success, userData, token, message }`

- `GET /check` - Verify authentication (protected)
  - Returns: `{ success, user }`

- `PUT /update-profile` - Update user profile (protected)
  - Body: `{ fullName, bio, profilePic? }`
  - Returns: `{ success, user }`

**Message Routes** (`/api/messages`)
- `GET /users` - Get all users with unseen message counts (protected)
  - Returns: `{ success, users, unseenMessages }`

- `GET /:id` - Get message history with specific user (protected)
  - Returns: `{ success, messages }`
  - Auto-marks messages as seen

- `POST /send/:id` - Send message to user (protected)
  - Body: `{ text?, image? }`
  - Returns: `{ success, newMessage }`
  - Emits real-time event via Socket.io

- `PUT /mark/:id` - Mark message as seen (protected)
  - Returns: `{ success }`

#### Database Models

**User Model**
```javascript
{
  email: String (unique, required),
  fullName: String (required),
  password: String (required, minLength: 6),
  profilePic: String (default: ""),
  bio: String (default: ""),
  isOnline: Boolean (default: false),
  lastSeen: Date (default: current date),
  timestamps: { createdAt, updatedAt }
}
```

**Message Model**
```javascript
{
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  text: String (optional),
  image: String (optional),
  seen: Boolean (default: false),
  timestamps: { createdAt, updatedAt }
}
```

#### Socket.io Events

**Client → Server**
- Connection with userId query parameter

**Server → Client**
- `getOnlineUsers` - Emitted on connect/disconnect, sends list of online user IDs
- `newMessage` - Emitted when a new message is received

#### Middleware
- **Auth Middleware** (`protectRoute`) - Validates JWT token and attaches user data to request

#### Utilities
- **Token Generation** - JWT token creation with user ID
- **Cloudinary Upload** - Image upload and URL retrieval
- **Database Connection** - MongoDB connection setup

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)
- npm or yarn package manager

### Client Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in client directory:
```
VITE_BACKEND_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

### Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

4. Start server:
```bash
npm run server    # Development mode with nodemon
npm run start     # Production mode
```

---

## 📦 Dependencies Overview

### Client Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI framework |
| react-dom | 19.1.1 | React DOM rendering |
| react-router-dom | 7.8.1 | Client-side routing |
| axios | 1.11.0 | HTTP client |
| socket.io-client | 4.8.1 | Real-time communication |
| tailwindcss | 4.1.12 | CSS framework |
| react-hot-toast | 2.6.0 | Toast notifications |

### Server Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.1.0 | Web framework |
| mongoose | 8.18.0 | MongoDB ODM |
| socket.io | 4.8.1 | Real-time communication |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 3.0.2 | Password hashing |
| cloudinary | 2.7.0 | Image storage |
| dotenv | 17.2.1 | Environment variables |
| cors | 2.8.5 | Cross-origin support |

---

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds for secure password storage
2. **JWT Authentication**: Token-based authentication for API protection
3. **Protected Routes**: Server-side middleware validates tokens on protected endpoints
4. **CORS**: Configured to prevent unauthorized cross-origin requests
5. **Cloudinary Integration**: Secure image upload and CDN delivery
6. **Session Management**: Tokens stored securely in localStorage

---

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices
- **Tailwind CSS**: Responsive utilities for all screen sizes
- **Conditional Rendering**: Components adapt to screen size
- **Flexible Layouts**: Grid and flex layouts for responsive UI
- **Touch-Friendly**: Optimized for touch interactions

---

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark gradient backgrounds
- **Real-time Status**: Live online/offline indicators
- **Toast Notifications**: User feedback for actions
- **Smooth Transitions**: CSS transitions for better UX
- **Responsive Navigation**: Hamburger menu on mobile
- **Search Functionality**: Find users quickly
- **Visual Feedback**: Unseen message badges and selection states

---

## 🔄 Data Flow

### Authentication Flow
1. User enters credentials on LoginPage
2. AuthContext calls login function
3. Axios sends POST request to `/api/auth/signup` or `/api/auth/login`
4. Server validates and returns token + userData
5. Client stores token in localStorage and context
6. Socket.io connection established with userId
7. User redirected to HomePage

### Message Flow
1. User selects another user from Sidebar
2. ChatContext fetches message history via `/api/messages/:id`
3. Messages displayed in ChatContainer
4. User types and sends message
5. ChatContext sends POST to `/api/messages/send/:id`
6. Server uploads image to Cloudinary if present
7. Message stored in MongoDB
8. Socket.io emits to receiver's socket
9. Both clients update message list in real-time

### Online Status Flow
1. User connects via Socket.io with userId
2. Server adds userId to userSocketMap
3. Server emits `getOnlineUsers` with all online user IDs
4. All clients update their onlineUser list
5. UI displays online status for each user
6. On disconnect, user removed from map and update broadcast

---

## 🛠️ Development Scripts

### Client
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server
```bash
npm run server   # Start with nodemon (development)
npm run start    # Start Node (production)
```

---

## 📝 Environment Variables

### Client (.env)
- `VITE_BACKEND_URL` - Backend API URL

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `CLOUDINARY_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - CORS allowed origins

---

## 🚀 Deployment

Both client and server include `vercel.json` configuration files for easy deployment on Vercel.

### Client Deployment
- Build output: `dist/`
- Deploy to Vercel with `npm run build`

### Server Deployment
- Single entry point: `server.js`
- Deploy to Vercel serverless functions

---

## 📄 License

ISC License

---

## 👨‍💻 Developer

**Developed by: MD. SAKIB**
- Website: [sakibdeveloper.com](https://sakibdeveloper.com)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests for any improvements.

---

## ⚠️ Error Handling

The application includes comprehensive error handling:
- Frontend: React Hot Toast for user-friendly error messages
- Backend: Try-catch blocks with detailed error logging
- Network: Axios interceptors for request/response handling
- Socket.io: Connection state management and reconnection logic

---

## 📞 Support

For issues or questions about the application, please create an issue in the repository.

---

**Last Updated**: December 2025
