# Google OAuth Full-Stack Application

A complete production-ready Google OAuth 2.0 authentication system built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Google OAuth 2.0 Authentication** with Passport.js
- **JWT Token Management** for secure sessions
- **Modern React Frontend** with Vite and Tailwind CSS
- **RESTful API** with Express.js
- **MongoDB Integration** with Mongoose
- **Responsive Design** with clean, modern UI
- **Loading States** and error handling
- **Modular Architecture** for scalability

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- Passport.js (Google OAuth Strategy)
- MongoDB with Mongoose
- JWT for authentication
- Express Session

## 📁 Project Structure

```
google-oauth-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database & Passport config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── package.json
├── .env                 # Environment variables
└── package.json        # Root package.json
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Cloud Console account

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install-all
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
7. Copy Client ID and Client Secret

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string

### 4. Environment Configuration

Update `.env` file with your credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# MongoDB Configuration (choose one)
MONGODB_URI=mongodb://localhost:27017/google-oauth-app  # Local
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/google-oauth-app  # Atlas

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 5. Run the Application

```bash
# Start both client and server concurrently
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🧪 Testing the Application

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Login**: Click "Continue with Google" button
3. **Authorize**: Complete Google OAuth flow
4. **Dashboard**: View your profile information
5. **Logout**: Test logout functionality

## 📡 API Endpoints

### Authentication Routes
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user

### User Routes
- `GET /api/me` - Get current user profile (Protected)

## 🔒 Security Features

- **JWT Token Authentication**
- **Secure Session Management**
- **CORS Configuration**
- **Environment Variable Protection**
- **Input Validation**

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Loading States** - Visual feedback during operations
- **Modern Design** - Clean, professional interface
- **Error Handling** - User-friendly error messages
- **Smooth Transitions** - Enhanced user experience

## 🚀 Production Deployment

### Environment Variables for Production
```env
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
MONGODB_URI=production_mongodb_uri
JWT_SECRET=production_jwt_secret
PORT=5000
CLIENT_URL=https://yourdomain.com
```

### Build Commands
```bash
# Build client for production
cd client && npm run build

# Start server in production
cd server && npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **OAuth Error**: Verify Google Client ID/Secret and redirect URIs
2. **MongoDB Connection**: Check MongoDB service and connection string
3. **CORS Issues**: Ensure CLIENT_URL matches frontend URL
4. **Port Conflicts**: Change PORT in .env if 5000 is occupied

### Debug Mode
```bash
# Run server with debug logs
cd server && DEBUG=* npm run dev
```

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Built with ❤️ for hackathons and learning purposes**