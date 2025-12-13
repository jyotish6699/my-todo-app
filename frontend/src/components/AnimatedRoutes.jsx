import { useContext, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AuthContext from '../context/AuthContext'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import PageTransition from './PageTransition'

const AnimatedRoutes = () => {
  const location = useLocation()
  const { reset } = useContext(AuthContext)

  // Clear auth state errors/messages on route change
  useEffect(() => {
    reset()
  }, [location.pathname, reset])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          {/* Public/Guest Routes */}
          <Route path='/' element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path='/today' element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path='/important' element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path='/completed' element={<PageTransition><Dashboard /></PageTransition>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<PageTransition><Profile /></PageTransition>} />
              <Route path='/settings' element={<PageTransition><Settings /></PageTransition>} />
          </Route>

          {/* Authentication Routes */}
          <Route path='/login' element={<PageTransition><Login /></PageTransition>} />
          <Route path='/register' element={<PageTransition><Register /></PageTransition>} />
          
          {/* Catch all */}
          <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes
