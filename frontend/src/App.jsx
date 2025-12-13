import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
              {/* Public/Guest Routes */}
              <Route path='/' element={<Dashboard />} />
              <Route path='/today' element={<Dashboard />} />
              <Route path='/important' element={<Dashboard />} />
              <Route path='/completed' element={<Dashboard />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/settings' element={<Settings />} />
              </Route>

              {/* Authentication Routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              
              {/* Catch all */}
              <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
