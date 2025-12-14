import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_URL = `${BASE_URL}/users/`;

// Helper to save user without profilePic to limit LocalStorage usage
const saveUserToLocalStorage = (data) => {
    const userToSave = { ...data };
    if (userToSave.profilePic && userToSave.profilePic.length > 1000) {
         userToSave.profilePic = null; // Too big for LS
    }
    localStorage.setItem('user', JSON.stringify(userToSave));
}

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    saveUserToLocalStorage(response.data)
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    saveUserToLocalStorage(response.data)
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

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'profile', userData, config)

  if (response.data) {
    if (!response.data.token) {
        response.data.token = token;
    }
    saveUserToLocalStorage(response.data)
  }

  return response.data
}

// Get user data (Refetch full profile including pic)
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'me', config)
  return response.data
}

const authService = {
  register,
  logout,
  login,
  deleteUser,
  updateProfile,
  getMe,
}

export default authService
