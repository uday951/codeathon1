import { useState } from 'react'
import { logout } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Hackathon Dashboard</h1>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Hackathon Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="text-center">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">🎉 Welcome to the Hackathon! 🎉</h1>
                <p className="text-xl opacity-90">Powered by Student Tribe</p>
              </div>
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff&size=150`}
                alt={user.name}
                className="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-lg mb-4"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff&size=150`
                }}
              />
              <h2 className="text-2xl font-bold mb-2">
                Hello, {user.name}!
              </h2>
              <p className="text-lg opacity-90">
                Ready to build something amazing? Let's code! 🚀
              </p>
            </div>
          </div>

          {/* Hackathon Info */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">🏆 Hackathon Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">⏰</div>
                <h4 className="font-semibold text-gray-900">Event Status</h4>
                <p className="text-sm text-gray-600">Live Now!</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-semibold text-gray-900">Team</h4>
                <p className="text-sm text-gray-600">Solo Hacker</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900">Challenge</h4>
                <p className="text-sm text-gray-600">OAuth Integration</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">👤 Participant Profile</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Full Name</span>
                <span className="text-sm text-gray-900">{user.name}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Email Address</span>
                <span className="text-sm text-gray-900">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">User ID</span>
                <span className="text-sm text-gray-900 font-mono">{user.id}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Authentication Method</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Google OAuth 2.0
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-500">Hackathon Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ✅ Registered & Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard