import axios from 'axios'

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Delete user
const deleteUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + 'me', config)

  if (response.data) {
      localStorage.removeItem('user')
  }

  return response.data
}

const authService = {
  register,
  logout,
  login,
  deleteUser,
}

export default authService
