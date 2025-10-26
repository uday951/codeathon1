import React, { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState(null);

  const providers = [
    { name: 'google', label: 'Google', color: 'border-red-200 hover:border-red-300 hover:bg-red-50', textColor: 'text-red-600', bgColor: 'bg-white', enabled: true },
    { name: 'github', label: 'GitHub', color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', textColor: 'text-gray-700', bgColor: 'bg-white', enabled: true },
    { name: 'facebook', label: 'Facebook', color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50', textColor: 'text-blue-600', bgColor: 'bg-white', enabled: true },
    { name: 'linkedin', label: 'LinkedIn', color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50', textColor: 'text-blue-700', bgColor: 'bg-white', enabled: true },
    { name: 'twitter', label: 'Twitter', color: 'border-sky-200 hover:border-sky-300 hover:bg-sky-50', textColor: 'text-sky-600', bgColor: 'bg-white', enabled: true },
    { name: 'instagram', label: 'Instagram', color: 'border-pink-200 hover:border-pink-300 hover:bg-pink-50', textColor: 'text-pink-600', bgColor: 'bg-white', enabled: true },
    { name: 'reddit', label: 'Reddit', color: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50', textColor: 'text-orange-600', bgColor: 'bg-white', enabled: true }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get('user');
    const isError = window.location.pathname === '/error';

    if (userData) {
      try {
        setUser(JSON.parse(decodeURIComponent(userData)));
        window.history.replaceState({}, document.title, '/');
      } catch (err) {
        setError('Failed to parse user data');
      }
    } else if (isError) {
      setError('Authentication failed');
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLogin = (provider) => {
    setLoading(provider);
    setError(null);
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  const handleLogout = () => {
    setUser(null);
    setError(null);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <img
                src={user.picture || user.avatar_url || user.profile_image_url || 'https://via.placeholder.com/80'}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-200"
              />
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {user.name || user.username || user.login}
              </h1>
              <p className="text-gray-600 mb-3">{user.email || 'No email provided'}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected via {user.provider}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Provider ID</span>
                  <span className="text-sm text-gray-900 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm text-gray-900">{user.name || user.username || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm text-gray-900">{user.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email Verified</span>
                  <span className={`text-sm font-medium ${
                    user.email_verified ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {user.email_verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account using any provider</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {providers.map((provider) => (
              <button
                key={provider.name}
                onClick={() => provider.enabled ? handleLogin(provider.name) : null}
                disabled={loading === provider.name || !provider.enabled}
                className={`w-full ${provider.bgColor} border-2 ${provider.color} rounded-lg px-4 py-3 flex items-center justify-center space-x-3 transition-all duration-200 disabled:opacity-50 ${!provider.enabled ? 'cursor-not-allowed' : ''}`}
              >
                <span className={`font-medium ${provider.textColor}`}>
                  {loading === provider.name ? 'Connecting...' : `Continue with ${provider.label}`}
                </span>
                {loading === provider.name && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-medium">unified-oauth</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;