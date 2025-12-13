import Layout from '../components/Layout';
import { FaToggleOn, FaBell, FaMoon, FaGlobe, FaLock } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
      deleteAccount();
      navigate('/');
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto custom-scrollbar pb-20 relative">
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Account?</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                        Are you sure you want to delete this account? This action cannot be undone and all your data will be lost.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-3xl mx-auto pt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

            <div className="space-y-6">
                
                {/* Account Settings */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaGlobe className="text-blue-500" /> Account & Profile
                    </h3>
                    <div className="space-y-4 divide-y divide-gray-100 dark:divide-dark-700">
                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Edit Profile</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Update your name and personal details.</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition">Manage</button>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Change Password</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Update your security credentials.</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition">Update</button>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaMoon className="text-purple-500" /> Appearance
                    </h3>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Dark Mode</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Switch to a darker theme for low-light conditions.</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`text-4xl transition-colors ${theme === 'dark' ? 'text-brand-500' : 'text-gray-300'}`}
                        >
                            <FaToggleOn className={`transform transition-transform ${theme === 'dark' ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaBell className="text-yellow-500" /> Notifications
                    </h3>
                    <div className="space-y-4 divide-y divide-gray-100 dark:divide-dark-700">
                            <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Email Notifications</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive digest emails about your tasks.</p>
                            </div>
                            <button className="text-brand-500 text-4xl"><FaToggleOn /></button>
                        </div>
                            <div className="flex items-center justify-between pt-4">
                            <div>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Desktop Alerts</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Get notified when tasks are due.</p>
                            </div>
                            <button className="text-brand-500 text-4xl"><FaToggleOn /></button>
                        </div>
                    </div>
                </div>

                {/* Privacy & Data */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaLock className="text-blue-500" /> Privacy & Data
                    </h3>
                        <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Data Sharing</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Allow us to collect anonymous usage data.</p>
                        </div>
                        <button className="text-gray-300 dark:text-dark-600 text-4xl"><FaToggleOn className="transform rotate-180" /></button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-700 flex items-center justify-between">
                         <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Export Data</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Download a JSON copy of all your tasks.</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition">Export JSON</button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-700">
                            <button 
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-500 font-semibold hover:text-red-600 text-sm"
                            >
                                Delete Account
                            </button>
                    </div>
                </div>

                 {/* Version Info */}
                 <div className="text-center text-gray-400 dark:text-dark-500 text-sm pb-8">
                    <p>GoalSetter App v1.0.0</p>
                </div>

            </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
