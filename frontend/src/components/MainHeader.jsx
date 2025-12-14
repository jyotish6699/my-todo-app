import { useState, useContext } from 'react';
import { FaRegBell, FaSearch, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const INITIAL_NOTIFICATIONS = [
    { id: 1, text: "Welcome to your new Todo App! 🚀", time: "Just now" },
    { id: 2, text: "Don't forget to check your daily tasks.", time: "2 hours ago" }
];

function MainHeader({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const { user } = useContext(AuthContext);

  const toggleNotificationPanel = () => {
      if (!showNotifications) {
          // Reset notifications when opening as requested
          setNotifications(INITIAL_NOTIFICATIONS);
      }
      setShowNotifications(!showNotifications);
  }

  const markAllAsRead = () => {
      setNotifications([]);
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-white text-xl p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
            <FaBars />
          </button>
          <span className="font-bold text-xl text-brand-600 md:hidden">GoalSetter</span>
      </div>
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-dark-800 px-4 py-2 rounded-lg w-96 transition-colors">
        <FaSearch className="text-gray-400 mr-3" />
        <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder-gray-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 relative">
        {user ? (
            <>
                <button 
                    onClick={toggleNotificationPanel}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 relative transition-colors"
                >
                    <FaRegBell className="text-xl" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-dark-900"></span>
                    )}
                </button>
                
                {/* Profile Pic in Header */}
                <div 
                    onClick={() => location.pathname === '/profile' ? navigate(-1) : navigate('/profile')}
                    className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-dark-700 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-200 transition-all"
                    title="Go to Profile"
                >
                    {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                             {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Notifications</h3>
                            <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition cursor-pointer border-b border-gray-50 dark:border-dark-700 last:border-none">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{notif.text}</p>
                                        <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No new notifications
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-2 border-t border-gray-100 dark:border-dark-700 text-center">
                                <button onClick={markAllAsRead} className="text-xs text-brand-500 hover:text-brand-600 font-medium">Mark all as read</button>
                            </div>
                        )}
                    </div>
                )}
            </>
        ) : (
             <div className="flex items-center gap-3">
                <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 transition">Log In</a>
                <a href="/register" className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition shadow-sm">Sign Up</a>
            </div>
        )}
      </div>
    </header>
  );
}

export default MainHeader;
