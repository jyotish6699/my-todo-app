import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import AuthContext from '../context/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const { login, isError, isSuccess, message, user, reset } = useContext(AuthContext)

  // Effect 1: Handle Navigation on Success/User existence
  useEffect(() => {
    if (isSuccess || user) {
      navigate('/')
    }
  }, [user, isSuccess, navigate])

  // Effect 2: Clear state on Unmount (when leaving the page)
  useEffect(() => {
      return () => {
          if (isError || message) {
              reset();
          }
      }
  }, [reset, isError, message])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900 rounded-full blur-[120px] opacity-20"></div>
        </div>

       {/* Main Card */}
       <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[600px] relative z-10">

           {/* Left Side - Form */}
           <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white relative">
                
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <FaLock className="text-xl" />
                     </div>
                     <span className="font-bold text-2xl text-gray-800 tracking-tight">GoalSetter</span>
                 </div>

                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                </div>

                {isError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                        <p className="font-bold text-sm">Authentication Error</p>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type='text'
                            className='w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none font-medium text-gray-700 placeholder-gray-400'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Email or Username'
                            onChange={onChange}
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type='password'
                            className='w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none font-medium text-gray-700 placeholder-gray-400'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={onChange}
                        />
                    </div>

                    <button type='submit' className='w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'>
                        Sign In
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500">
                    <span>New here?</span>
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-700 hover:underline">Create an account</Link>
                </div>
           </div>

           {/* Right Side - Visuals "Precious Look" */}
           <div className="w-full md:w-1/2 relative overflow-hidden hidden md:flex items-center justify-center">
                {/* Rich Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
                
                {/* Decorative overlay effects */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                {/* Glowing Orbs */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Content */}
                <div className="relative z-10 p-12 text-center text-white/90">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/20 shadow-2xl">
                         <FaLock className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Master Your Workflow</h2>
                    <p className="text-lg text-indigo-100 leading-relaxed max-w-sm mx-auto">
                        Experience productivity like never before. Organized, elegant, and secure.
                    </p>
                </div>
           </div>

       </div>
    </div>
  )
}

export default Login
