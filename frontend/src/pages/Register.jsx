import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    checkPassword: '',
  })

  const { name, email, password, checkPassword } = formData

  const navigate = useNavigate()
  const { register, isError, isSuccess, message, user, reset } = useContext(AuthContext)

  // Effect 1: Handle Navigation
  useEffect(() => {
    if (isSuccess || user) {
      navigate('/')
    }
  }, [user, isSuccess, navigate])

  // Effect 2: Cleanup on Unmount
  useEffect(() => {
    return () => {
        if (isError || message) {
            reset()
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

    if (password !== checkPassword) {
      alert('Passwords do not match')
    } else {
      register({ name, email, password })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 flex items-center justify-center p-4">
       {/* Card Container */}
       <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row h-[600px] relative z-10">
           
           {/* Left Side - Visuals */}
           <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden items-center justify-center p-8">
               {/* Decorative Circles matching the image */}
               <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full mix-blend-overlay"></div>
               <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-pink-500/30 rounded-full mix-blend-overlay blur-xl"></div>
               <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-lg"></div>
               
               <div className="relative z-10 text-center text-white">
                   <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Join the Fun</h2>
                   <p className="text-lg text-indigo-100 font-medium">Create valid tasks, organize your life, and achieve more.</p>
               </div>
           </div>

           {/* Right Side - Form */}
           <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center relative">
                <div className="max-w-sm w-full mx-auto">
                    
                    <div className="flex justify-end mb-4">
                        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-fuchsia-600 transition flex items-center gap-1">
                            Skip to Guest Mode &rarr;
                        </Link>
                    </div>

                    {/* Mobile Tab Switcher */}
                    <div className="flex md:hidden w-full mb-8 bg-gray-100 p-1 rounded-xl">
                        <Link to="/login" className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-center">
                            Log In
                        </Link>
                        <button className="flex-1 py-2 text-sm font-bold text-fuchsia-600 bg-white rounded-lg shadow-sm">
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-fuchsia-500 inline-block pb-1">Sign Up</h2>
                    
                    {isError && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r">
                            {message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="group">
                            <input
                            type='text'
                            className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium group-hover:bg-gray-100'
                            id='name'
                            name='name'
                            value={name}
                            placeholder='Full Name'
                            onChange={onChange}
                            />
                        </div>
                        <div className="group">
                            <input
                            type='email'
                            className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium group-hover:bg-gray-100'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Email Address'
                            onChange={onChange}
                            />
                        </div>
                        <div className="group">
                            <input
                            type='password'
                            className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium group-hover:bg-gray-100'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={onChange}
                            />
                        </div>
                        <div className="group">
                            <input
                            type='password'
                            className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 transition-all outline-none text-gray-800 placeholder-gray-400 font-medium group-hover:bg-gray-100'
                            id='checkPassword'
                            name='checkPassword'
                            value={checkPassword}
                            placeholder='Confirm Password'
                            onChange={onChange}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type='submit' className='flex-1 py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-fuchsia-500/40 transform hover:-translate-y-0.5'>
                                Register
                            </button>
                            <Link to="/login" className='flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors text-center'>
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
           </div>
       </div>
    </div>
  )
}

export default Register
