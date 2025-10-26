import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

// Configure axios to include credentials
axios.defaults.withCredentials = true

// Get user profile
export const getUser = async (token) => {
  try {
    const config = {
      withCredentials: true
    }
    
    // Add Authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/me`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// Logout user
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    })
    localStorage.removeItem('token')
  } catch (error) {
    localStorage.removeItem('token')
  }
}