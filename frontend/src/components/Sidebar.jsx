import { useNavigate, useLocation } from 'react-router-dom';
import { FaTasks, FaCalendarDay, FaStar, FaRegCheckCircle, FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'All Tasks', icon: <FaTasks />, path: '/' },
    { name: 'Today', icon: <FaCalendarDay />, path: '/today' }, 
    { name: 'Important', icon: <FaStar />, path: '/important' },
    { name: 'Completed', icon: <FaRegCheckCircle />, path: '/completed' },
  ];

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  return (
    <aside className="w-64 bg-sidebar dark:bg-dark-800 h-screen border-r border-gray-100 dark:border-dark-700 flex flex-col pt-8 px-4 hidden md:flex transition-colors duration-200">
      {/* Profile Section */}
      <div className="relative mb-10 z-50">
        <div 
            onClick={() => user && setIsDropdownOpen(!isDropdownOpen)} 
            className={`flex items-center gap-3 px-2 p-2 rounded-xl transition-colors group ${user ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700' : ''}`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md transition-transform ${user ? 'bg-brand-500 group-hover:scale-105' : 'bg-gray-400'}`}>
                {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">{user ? user.name : 'Guest User'}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user ? user.email : 'Guest Mode'}</p>
            </div>
             <div className="text-gray-400 dark:text-gray-500">
                {user ? (isDropdownOpen ? '▲' : '▼') : ''}
            </div>
        </div>

        {/* Dropdown Menu - Only show if user exists */}
        {isDropdownOpen && user && (
            <div className="absolute top-14 left-0 w-full bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                    onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center gap-3"
                >
                    <FaUserCircle className="text-gray-400" /> Profile
                </button>
                <button
                    onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center gap-3"
                >
                    <FaCog className="text-gray-400" /> Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-dark-700 mx-2"></div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition flex items-center gap-3"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu</div>
        <ul className="space-y-1 mb-8">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Guest Login Button */}
      {!user && (
         <div className="pb-8">
            <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5"
            >
                <FaSignInAlt />
                <span className="font-bold">Log In</span>
            </button>
         </div>
      )}

      
    </aside>
  );
}

export default Sidebar;
