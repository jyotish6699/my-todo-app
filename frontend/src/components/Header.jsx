import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

function Header() {
  const navigate = useNavigate()
  const { user, logout, reset } = useContext(AuthContext)

  const onLogout = () => {
    logout()
    reset()
    navigate('/')
  }

  return (
    <header className='header flex justify-between items-center p-5 border-b border-gray-200'>
      <div className='logo text-xl font-bold'>
        <Link to='/'>GoalSetter</Link>
      </div>
      <ul className='flex items-center gap-5'>
        {user ? (
          <li>
            <button className='btn flex items-center gap-2 hover:text-gray-600' onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login' className='flex items-center gap-2 hover:text-gray-600'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register' className='flex items-center gap-2 hover:text-gray-600'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
