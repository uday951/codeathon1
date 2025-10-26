# 🔐 OAuth Demo - unified-oauth Testing Setup

A complete testing setup demonstrating the `unified-oauth` package with Google OAuth integration.

## 🏗️ Project Structure

```
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config.js     # Environment configuration
│   │   ├── logger.js     # Logging utility
│   │   ├── oauth.js      # OAuth manager setup
│   │   ├── routes.js     # API routes
│   │   └── server.js     # Express server
│   ├── .env             # Environment variables
│   └── package.json
├── frontend/         # React + Vite UI
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   └── main.jsx     # React entry point
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Setup Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Update `backend/.env` with your credentials

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables

Update `backend/.env`:

```env
PORT=5000
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

## 🌊 OAuth Flow

1. **User clicks "Sign in with Google"** → Frontend redirects to backend
2. **Backend `/auth/google`** → unified-oauth generates Google OAuth URL
3. **Google OAuth consent** → User authorizes the application
4. **Google callback** → Backend receives authorization code
5. **Profile fetch** → unified-oauth exchanges code for user profile
6. **Success redirect** → Frontend displays user information

## 📊 API Endpoints

- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - Handle OAuth callback
- `GET /health` - Health check endpoint

## 🪵 Logging

Backend includes detailed logging:

```
[INFO] 2025-01-26T12:45:33Z - Redirecting to Google OAuth
[INFO] 2025-01-26T12:45:45Z - Received OAuth callback
[SUCCESS] 2025-01-26T12:45:46Z - User authenticated: user@gmail.com
[ERROR] 2025-01-26T12:46:01Z - Failed to fetch profile: Invalid code
```

## 🎨 Frontend Features

- Modern, responsive UI with Tailwind CSS
- Loading states during OAuth process
- Error handling and user feedback
- Clean user profile display
- Logout functionality

## 🔄 Adding More Providers

To add GitHub, Facebook, or other providers:

1. **Backend** - Add provider configuration in `src/oauth.js`:
```javascript
oauthManager.addProvider('github', {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_REDIRECT_URI
});
```

2. **Routes** - Add new routes in `src/routes.js`
3. **Frontend** - Add new sign-in buttons in `App.jsx`

## 🛠️ Development

- Backend uses ES Modules with `--watch` for auto-restart
- Frontend uses Vite for fast development and HMR
- CORS configured for cross-origin requests
- Clean, modular code structure for easy maintenance

## 📦 Dependencies

### Backend
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `unified-oauth` - Your OAuth package

### Frontend
- `react` - UI library
- `vite` - Build tool and dev server
- `axios` - HTTP client (ready for API calls)
- `tailwindcss` - Utility-first CSS framework

## 🎯 Testing the Setup

1. Start both servers
2. Open http://localhost:5173
3. Click "Sign in with Google"
4. Complete OAuth flow
5. View user profile and logs

The setup demonstrates professional, scalable architecture ready for production use!