import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext.jsx'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const captain = {
      email: email,
      password,
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data
      setCaptain(data.captain)

      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-7 w-full max-w-md lg:max-w-xl">
        <img
          className="w-20 mx-auto mb-8"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Captain Logo"
        />

        <form onSubmit={submitHandler} className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-700">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-xl font-semibold text-gray-700">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-200 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="password"
          />

          <button
            className="bg-black text-white font-semibold rounded-lg px-4 py-2 w-full text-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Join a fleet?{' '}
          <Link to="/captain-signup" className="text-blue-600 font-medium hover:underline">
            Register as a Captain
          </Link>
        </p>

        <div className="mt-8">
          <Link
            to="/login"
            className="bg-orange-600 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-2 w-full text-lg hover:bg-orange-700 transition"
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin
