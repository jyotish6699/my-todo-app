import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import authService from '../features/auth/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage to avoid blinking/redirect loops
  const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')

  // Hydrate full user profile (images/settings) on app load
  useEffect(() => {
    const fetchFullProfile = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.token) {
            try {
                const freshData = await authService.getMe(storedUser.token);
                // getMe returns user object (without token usually), merge it
                setUser(prev => ({ ...prev, ...freshData, token: storedUser.token }));
            } catch (error) {
                console.error("Failed to refresh profile:", error);
                if (error.response?.status === 401) {
                    authService.logout();
                    setUser(null);
                }
            }
        }
    };
    fetchFullProfile();
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      const data = await authService.register(userData)
      setUser(data)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      const data = await authService.login(userData)
      setUser(data)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const deleteAccount = useCallback(async () => {
      setIsLoading(true)
      try {
          if (!user || !user.token) return;
          
          await authService.deleteUser(user.token)
          setUser(null)
          setIsSuccess(true)
      } catch (error) {
          setIsError(true)
          setMessage(error.response?.data?.message || error.message)
      } finally {
          setIsLoading(false)
      }
  }, [user])

  const updateProfile = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      if (!user || !user.token) return false;
      const data = await authService.updateProfile(userData, user.token)
      setUser(data)
      setIsSuccess(true)
      return true;
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.message || error.message)
      return false;
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const reset = useCallback(() => {
    setIsError(false)
    setIsSuccess(false)
    setIsLoading(false)
    setMessage('')
  }, [])
  const refetchUser = useCallback(async () => {
      if (!user || !user.token) return;
      try {
          const freshData = await authService.getMe(user.token);
          setUser(prev => ({ ...prev, ...freshData, token: user.token }));
      } catch (error) {
          console.error("Failed to refetch user:", error);
      }
  }, [user]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isError,
    isSuccess,
    message,
    register,
    login,
    logout,
    deleteAccount,
    updateProfile,
    refetchUser, // Expose this
    reset,
  }), [user, isLoading, isError, isSuccess, message, register, login, logout, deleteAccount, updateProfile, refetchUser, reset])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
