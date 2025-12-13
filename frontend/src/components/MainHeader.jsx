import { useState, useContext } from 'react';
import { FaRegBell, FaSearch } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

function MainHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-2 md:hidden">
          <span className="font-bold text-xl text-brand-600">GoalSetter</span>
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
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 relative transition-colors"
                >
                    <FaRegBell className="text-xl" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-dark-900"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition cursor-pointer">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Welcome to your new Todo App! 🚀</p>
                                <span className="text-xs text-gray-400 mt-1 block">Just now</span>
                            </div>
                             <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition cursor-pointer border-t border-gray-50 dark:border-dark-700">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Don't forget to check your daily tasks.</p>
                                <span className="text-xs text-gray-400 mt-1 block">2 hours ago</span>
                            </div>
                        </div>
                        <div className="p-2 border-t border-gray-100 dark:border-dark-700 text-center">
                            <button className="text-xs text-brand-500 hover:text-brand-600 font-medium">Mark all as read</button>
                        </div>
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
