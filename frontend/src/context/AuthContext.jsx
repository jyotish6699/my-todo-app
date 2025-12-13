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

  const reset = useCallback(() => {
    setIsError(false)
    setIsSuccess(false)
    setIsLoading(false)
    setMessage('')
  }, [])

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
    reset,
  }), [user, isLoading, isError, isSuccess, message, register, login, logout, deleteAccount, reset])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
