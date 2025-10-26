import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { getUser } from './utils/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check for token in URL first (from OAuth callback)
      const urlParams = new URLSearchParams(window.location.search)
      let token = urlParams.get('token')
      
      // If no token in URL, check localStorage
      if (!token) {
        token = localStorage.getItem('token')
      } else {
        // Store token from URL to localStorage
        localStorage.setItem('token', token)
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      
      if (token) {
        const userData = await getUser(token)
        console.log('User data received:', JSON.stringify(userData, null, 2))
        console.log('Picture URL:', userData.picture)
        setUser(userData)
      }
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App