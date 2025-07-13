import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext.jsx'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const { user, setUser } = useContext(UserDataContext)

  const navigate = useNavigate()
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className="p-7 min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-10">
        <div className="flex flex-col items-center mb-10">
          <img
            className="w-20 mb-5"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="User Logo"
          />
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
        </div>

        <form
          onSubmit={(e) => {
            submitHandler(e)
          }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">What's your name</h3>
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                required
                className="bg-gray-100 rounded-lg px-4 py-3 border text-lg placeholder:text-base w-full lg:w-1/2"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className="bg-gray-100 rounded-lg px-4 py-3 border text-lg placeholder:text-base w-full lg:w-1/2"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className="bg-gray-100 rounded-lg px-4 py-3 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              className="bg-gray-100 rounded-lg px-4 py-3 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required
              type="password"
              placeholder="password"
            />
          </div>

          <button className="bg-black text-white font-semibold rounded-lg px-6 py-3 w-full lg:w-auto lg:px-10 lg:py-3 text-lg">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-6">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline">Google Privacy Policy</span> and{' '}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  )
}

export default UserSignup
