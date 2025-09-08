import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign Up") // login, signup
  const [fullName, setFullName] = useState("") // Full Name
  const [email, setEmail] = useState("") // Email
  const [password, setPassword] = useState("") // Password
  const [bio, setBio] = useState("") // Bio
  const [isDataSubmitted, setIsDataSubmitted] = useState(false) // is Data Submitted

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (currState === "Sign Up" && !isDataSubmitted) {
      // move to next state
      setIsDataSubmitted(true)
      return;
    }
    login(currState === "Sign Up" ? "signup" : "login", { fullName, email, password, bio })
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left side */}
      <div className='flex flex-col items-center'>
        <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
        <p className='text-gray-300 mt-4 text-sm text-center max-w-[300px]'>Connect with friends and the world around you on SecureChat App.</p> <hr className=' h-1/2 w-50 my-2 border-t border-gray-500' />
        <p className='text-gray-300 text-sm mt-1'>This SecureChat App Develop by <a href="https://sakibdeveloper.com" className='text-violet-400/50'>MD. SAKIB</a></p>
      </div>
      {/* right side */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}

        </h2>
        {currState === "Sign Up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName}
            type="text" placeholder='Full Name' required className='p-2 border border-gray-500 rounded-md focus:outline-none ' />
        )}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}
        {
          currState === "Sign Up" && isDataSubmitted && (
            <textarea onChange={(e) => setBio(e.target.value)} value={bio}
              placeholder='Provide a short Bio.....' rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none' />
          )
        }
        <button type='submit' className='py-3  bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {
            currState === "Sign Up" ? "Create Account" : "Login Now"
          }
        </button>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" ? (
            <p className='text-sm text-gray-600'>Already have an account?
              <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'> Login here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600' >Create an account
              <span onClick={() => setCurrState("Sign Up")} className='font-medium text-violet-500 cursor-pointer'> Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage