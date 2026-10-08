import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const { login, user } = useAuth()


  useEffect(() => {

    if (user) {
      navigate('/')
    }

  }, [user, navigate])


  const handleLogin = async (e) => {

    e.preventDefault()

    if (!username || !password) {

      setError('Username and password are required')

      return

    }

    try {

      const res = await api.post(
        '/login/',
        {
          username: username,
          password: password
        }
      )

      setError('')

      login(res.data)

      navigate('/')

    } catch (error) {

      console.log(error.response?.data)

      setError('Invalid username or password')

    }

  }


  return (

    <>

      {/* NAVBAR */}

      <nav className="navbar navbar-expand-lg custom-navbar">

        <div className="container">

          <div
            className="navbar-brand d-flex align-items-center gap-2"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >

            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
            >

              <path
                d="M20 80 V20 L50 60 V20 H60 V80 H50 L20 40 V80 Z"
                fill="white"
              />

              <path
                d="M65 20 H85 C92 20 92 35 85 40 C92 45 92 60 85 60 H65 V20 Z"
                fill="white"
              />

            </svg>

            <span className="brand-text">
              NEW BALANCE
            </span>

          </div>


          <button
            className="btn btn-outline-light"
            onClick={() => navigate('/register')}
          >
            Register
          </button>

        </div>

      </nav>


      {/* LOGIN FORM */}

      <div className="container mt-5">

        <div className="auth-form">

          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <input
              className="form-control mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />


            {/* PASSWORD */}

            <div className="password-wrapper">

              <input
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >

                {showPassword ? (

                  /* EYE OFF */

                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 9 4 10 8a10.8 10.8 0 0 1-4.1 5.4" />
                    <path d="M6.6 6.6C4.8 7.8 3.4 9.5 2 12c1 4 5 8 10 8 1.5 0 2.9-.3 4.1-.9" />
                  </svg>

                ) : (

                  /* EYE */

                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>

                )}

              </button>

            </div>


            {error && (
              <div className="text-danger mb-3 mt-3">
                {error}
              </div>
            )}


            <button
              className="btn btn-dark w-100 mt-3"
              type="submit"
            >
              Login
            </button>

          </form>


          <div className="text-center mt-4">

            <span>
              Don't have an account?{' '}
            </span>

            <button
              className="auth-link"
              onClick={() => navigate('/register')}
            >
              Register
            </button>

          </div>

        </div>

      </div>

    </>

  )
}

export default Login