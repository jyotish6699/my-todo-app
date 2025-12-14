import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import Layout from '../components/Layout';

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
      return null;
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto no-scrollbar pb-20">
          <div className="max-w-4xl mx-auto pt-10">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden transition-colors">
                
                {/* Header */}
                <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-600 relative">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition font-medium flex items-center gap-2"
                    >
                        &larr; Back
                    </button>
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-800 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 font-bold overflow-hidden shadow-md">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (user && user.name) ? user.name.charAt(0).toUpperCase() : 'G'
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold uppercase tracking-wide">
                            Free Plan
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
                            Member
                        </span>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="p-6 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FaUserCircle className="text-brand-500" /> Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                    <p className="text-gray-900 dark:text-gray-200 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                    <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="p-6 bg-gray-50 dark:bg-dark-900/50 rounded-xl border border-gray-200 dark:border-dark-700 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FaShieldAlt className="text-brand-500" /> Security
                            </h3>
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                                    <p className="text-gray-900 dark:text-gray-200 font-medium">•••••••••••••</p>
                                    <button className="text-brand-600 dark:text-brand-400 text-sm font-semibold hover:underline mt-1">Change Password</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </Layout>
  );
}

export default Profile;
