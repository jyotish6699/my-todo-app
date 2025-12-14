import Layout from '../components/Layout';
import { FaToggleOn, FaBell, FaMoon, FaGlobe, FaLock, FaCamera, FaSave, FaTrash } from 'react-icons/fa';
import Toast from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const { theme, toggleTheme, customColor, setCustomColor } = useTheme();
  const { user, deleteAccount, updateProfile, isLoading, isError, message, refetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [editingProfile, setEditingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Default Settings State
  const [defaultColor, setDefaultColor] = useState(user?.settings?.defaultColor || '');
  const [defaultFontSize, setDefaultFontSize] = useState(user?.settings?.defaultFontSize || '18px');
  const [defaultFontStyle, setDefaultFontStyle] = useState(user?.settings?.defaultFontStyle || 'sans-serif');
  const [dashboardColor, setDashboardColor] = useState(user?.settings?.dashboardColor || '');
  const [viewDensity, setViewDensity] = useState(user?.settings?.viewDensity || 'comfortable');
  const [cardStyle, setCardStyle] = useState(user?.settings?.cardStyle || 'modern');

  useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        setProfilePic(user.profilePic || '');
        if (user.settings) {
            setDefaultColor(user.settings.defaultColor || '');
            setDefaultFontSize(user.settings.defaultFontSize || '18px');
            setDefaultFontStyle(user.settings.defaultFontStyle || 'sans-serif');
            setDashboardColor(user.settings.dashboardColor || '');
            setViewDensity(user.settings.viewDensity || 'comfortable');
            setCardStyle(user.settings.cardStyle || 'modern');
        }
    }
  }, [user]);

  const handleDelete = () => {
      deleteAccount();
      navigate('/');
  }

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 10 * 1024 * 1024) {
              alert("File too large. Please select an image under 10MB.");
              return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.src = event.target.result;
              
              img.onload = () => {
                   try {
                      const canvas = document.createElement('canvas');
                      const MAX_WIDTH = 500; 
                      
                      let width = img.width;
                      let height = img.height;

                      if (width > MAX_WIDTH) {
                          height = Math.round((height * MAX_WIDTH) / width);
                          width = MAX_WIDTH;
                      }

                      canvas.width = width;
                      canvas.height = height;
                      
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, width, height);
                      
                      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                      setProfilePic(compressedDataUrl);
                   } catch (err) {
                       console.error("Image processing error", err);
                       alert("Failed to process image. Please try another.");
                   }
              }
              
              img.onerror = () => {
                  alert("Failed to load image file.");
              }
          };
          reader.readAsDataURL(file);
      }
  };

const handleProfileUpdate = async (e) => {
      e.preventDefault();
      const success = await updateProfile({
          name,
          email,
          profilePic,
          settings: {
              defaultColor,
              defaultFontSize,
              defaultFontStyle,
              dashboardColor,
              viewDensity,
              cardStyle
          }
      });
      if (success) {
          await refetchUser();
          setEditingProfile(false);
          setToast({ show: true, message: 'Profile updated successfully!' });
      }
  };
  
  const handleCancel = () => {
      if (user) {
          setName(user.name);
          setEmail(user.email);
          setProfilePic(user.profilePic || '');
          if (user.settings) {
            setDefaultColor(user.settings.defaultColor || '');
            setDefaultFontSize(user.settings.defaultFontSize || '18px');
            setDefaultFontStyle(user.settings.defaultFontStyle || 'sans-serif');
            setDashboardColor(user.settings.dashboardColor || '');
        }
      }
      setEditingProfile(false);
  };

  const handlePasswordChange = (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
          setPasswordMessage("Passwords do not match");
          return;
      }
      updateProfile({ password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
      setPasswordMessage("Password updated successfully");
      setTimeout(() => setPasswordMessage(''), 3000);
  };

  return (
    <Layout>
      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <div className="h-full overflow-y-auto no-scrollbar smooth-scroll pb-20 relative">
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-lg shadow-red-200 dark:shadow-none"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-3xl mx-auto pt-6 px-4">
            
            {/* Sticky Back Button */}
            <div className="sticky top-0 z-30 flex justify-start pb-4 pt-2 pointer-events-none">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/50 dark:bg-dark-800/50 backdrop-blur-md shadow-sm border border-gray-200/50 dark:border-dark-700/50 text-gray-700 dark:text-gray-200 rounded-full hover:bg-white dark:hover:bg-dark-800 transition pointer-events-auto"
                    title="Go Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>

            <div className="space-y-6">
                
                {/* Account Settings */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <FaGlobe className="text-blue-500" /> Public Profile
                    </h3>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center gap-4">
                             <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-dark-700 ring-4 ring-white dark:ring-dark-800 shadow-md">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                        {(user && user.name) ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <div 
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                                    onClick={() => editingProfile && fileInputRef.current?.click()}
                                >
                                    <FaCamera className="text-white text-xl" />
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={!editingProfile}
                                />
                             </div>
                             {editingProfile && (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setProfilePic('');
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                >
                                    Remove Photo
                                </button>
                             )}
                        </div>

                        {/* Profile Form */}
                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!editingProfile}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!editingProfile}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors"
                                />
                            </div>
                            
                            {/* Default Note Settings (Only show when editing) */}
                            {editingProfile && (
                                <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Default Note Style</p>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
                                            <input 
                                                type="color" 
                                                value={defaultColor}
                                                onChange={(e) => setDefaultColor(e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                                             <select 
                                                value={defaultFontSize}
                                                onChange={(e) => setDefaultFontSize(e.target.value)}
                                                className="bg-gray-50 dark:bg-dark-700 border-none rounded text-sm py-1"
                                             >
                                                 {['14px', '18px', '24px', '30px'].map(s => <option key={s} value={s}>{s}</option>)}
                                             </select>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Font:</span>
                                             <select 
                                                value={defaultFontStyle}
                                                onChange={(e) => setDefaultFontStyle(e.target.value)}
                                                className="bg-gray-50 dark:bg-dark-700 border-none rounded text-sm py-1"
                                             >
                                                 {['sans-serif', 'serif', 'monospace', 'cursive'].map(s => <option key={s} value={s}>{s}</option>)}
                                             </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                {!editingProfile ? (
                                    <button 
                                        onClick={() => setEditingProfile(true)}
                                        className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition shadow-md shadow-brand-500/20"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-end gap-2">
                                        {isError && (
                                            <p className="text-sm text-red-500">{message}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={handleCancel}
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={handleProfileUpdate}
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition shadow-md flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Settings */}
                 <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaLock className="text-yellow-500" /> Security
                    </h3>
                    {!changingPassword ? (
                        <div className="flex items-center justify-between">
                             <div>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">Password</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Last changed: Never</p>
                            </div>
                            <button 
                                onClick={() => setChangingPassword(true)}
                                className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition"
                            >
                                Change Password
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-md animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                                />
                            </div>
                            {passwordMessage && <p className={`text-sm ${passwordMessage.includes('match') ? 'text-red-500' : 'text-green-500'}`}>{passwordMessage}</p>}
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => setChangingPassword(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handlePasswordChange}
                                    className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition shadow-md"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appearance - REUSED */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaMoon className="text-purple-500" /> App Appearance
                    </h3>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Dark Mode</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`text-4xl transition-colors ${theme === 'dark' ? 'text-brand-500' : 'text-gray-300'}`}
                        >
                            <FaToggleOn className={`transform transition-transform ${theme === 'dark' ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                    </div>
                     <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-dark-700 pt-4 mt-2">
                        <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Dashboard Color</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {customColor && (
                                <button 
                                    onClick={() => { setCustomColor(''); setDashboardColor(''); }}
                                    className="text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
                                >
                                    Reset
                                </button>
                            )}
                            <div className="relative group">
                                <input 
                                    type="color" 
                                    id="bgColorPicker"
                                    value={customColor || '#ffffff'}
                                    onChange={(e) => { setCustomColor(e.target.value); setDashboardColor(e.target.value); }}
                                    className="absolute inset-0 opacity-0 w-10 h-10 cursor-pointer z-10"
                                    title="Choose Custom Color"
                                />
                                <div 
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-800 shadow-md ring-2 ring-gray-200 dark:ring-dark-600 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: customColor || (theme === 'dark' ? '#1f2937' : '#ffffff') }}
                                ></div>
                            </div>
                        </div>
                    </div>

                     {/* View Density */}
                     <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-dark-700 pt-4 mt-2">
                        <div>
                             <p className="text-gray-900 dark:text-gray-200 font-medium">View Density</p>
                             <p className="text-xs text-gray-500">Spacing between tasks</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
                            {['comfortable', 'compact'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewDensity(mode)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${viewDensity === mode ? 'bg-white dark:bg-dark-600 shadow text-brand-600 dark:text-brand-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                     </div>

                     {/* Card Style */}
                     <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-dark-700 pt-4 mt-2">
                        <div>
                             <p className="text-gray-900 dark:text-gray-200 font-medium">Note Style</p>
                             <p className="text-xs text-gray-500">Card appearance</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
                            {['modern', 'minimal', 'flat'].map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setCardStyle(style)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${cardStyle === style ? 'bg-white dark:bg-dark-600 shadow text-brand-600 dark:text-brand-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                     </div>

                     {/* Save Button for Appearance Changes */}
                     <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handleProfileUpdate}
                            className="text-sm px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition shadow-sm"
                        >
                            Save Appearance
                        </button>
                     </div>
                </div>

                 {/* Danger Zone */}
                <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-500 mb-4 flex items-center gap-2">
                        <FaTrash /> Danger Zone
                    </h3>
                    <div className="flex items-center justify-between">
                         <div>
                            <p className="text-gray-900 dark:text-gray-200 font-medium">Delete Account</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Permanently remove your account and all notes.</p>
                        </div>
                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition"
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
