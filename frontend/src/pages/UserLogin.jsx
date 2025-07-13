import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext.jsx'

import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, setUser } = useContext(UserDataContext)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const userData = {
      email: email,
      password: password,
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-7 w-full max-w-md lg:max-w-xl">
        <img
          className="w-20 mx-auto mb-8"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="Logo"
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
          New here?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Create new Account
          </Link>
        </p>

        <div className="mt-8">
          <Link
            to="/captain-login"
            className="bg-green-500 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-2 w-full text-lg hover:bg-green-600 transition"
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
