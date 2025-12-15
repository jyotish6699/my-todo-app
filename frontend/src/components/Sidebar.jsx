import { useNavigate, useLocation } from 'react-router-dom';
import { FaTasks, FaCalendarDay, FaStar, FaRegCheckCircle, FaUserCircle, FaCog, FaSignOutAlt, FaSignInAlt, FaTimes } from 'react-icons/fa';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

function Sidebar({ isOpen, toggle }) {
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
    <aside className={`fixed inset-y-0 left-0 z-[60] bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transform transition-all duration-300 ease-in-out md:relative md:flex md:flex-col md:z-0 overflow-hidden
       ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 border-none opacity-0'} `}>
      
        {/* Mobile Close Button */}
        <button 
            onClick={toggle}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
            <FaTimes size={24} />
        </button>

      {/* Profile Section */}
      <div className="relative p-6 border-b border-gray-100 dark:border-dark-700 flex items-center gap-4">
        <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center gap-3 px-2 p-2 rounded-xl transition-colors group cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700"
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md overflow-hidden transition-transform ${user ? 'bg-brand-500 group-hover:scale-105' : 'bg-gray-400'}`}>
                {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    (user && user.name) ? user.name.charAt(0).toUpperCase() : 'G'
                )}
            </div>
            <div className="overflow-hidden">
                <h3 className="font-bold text-gray-800 dark:text-white truncate">{user ? user.name : 'Guest User'}</h3>
                {/* Email hidden short view */}
            </div>
             <div className="text-gray-400 dark:text-gray-500">
                {isDropdownOpen ? '▲' : '▼'}
            </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* User Only Options */}
                {user && (
                    <button
                        onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center gap-3"
                    >
                        <FaUserCircle className="text-gray-400" /> Profile
                    </button>
                )}

                {/* Common Options */}
                <button
                    onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center gap-3"
                >
                    <FaCog className="text-gray-400" /> Settings
                </button>

                <div className="h-px bg-gray-100 dark:bg-dark-700 mx-2"></div>
                
                {/* Login/Logout */}
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition flex items-center gap-3"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                ) : (
                     <button
                        onClick={() => { navigate('/login'); setIsDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition flex items-center gap-3"
                    >
                        <FaSignInAlt /> Log In
                    </button>
                )}
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
                onClick={() => { 
                    navigate(item.path); 
                    if (window.innerWidth < 768) toggle(); 
                }}
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
