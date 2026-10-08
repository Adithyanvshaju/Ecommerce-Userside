import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [otp, setOtp] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const { user } = useAuth()


  useEffect(() => {

    if (user) {
      navigate('/')
    }

  }, [user, navigate])


  // =========================
  // EMAIL VALIDATION
  // =========================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/


  // =========================
  // PASSWORD VALIDATION
  // =========================
  // Minimum 6 characters
  // At least one letter
  // At least one number
  // Special characters are allowed

  const strongPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d).{6,}$/


  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault()

    setError('')
    setMessage('')


    if (username.trim() === '') {

      setError('Username cannot be empty')

      return

    }


    if (username.length < 6) {

      setError(
        'Username must be at least 6 characters'
      )

      return

    }


    if (!emailRegex.test(email)) {

      setError('Invalid email format')

      return

    }


    if (!strongPasswordRegex.test(password)) {

      setError(
        'Password must be at least 6 characters and contain a letter and a number'
      )

      return

    }


    if (password !== rePassword) {

      setError('Passwords do not match')

      return

    }


    try {

      const response = await api.post(
        '/register/',
        {
          username,
          email,
          password
        }
      )


      setShowOTP(true)

      setMessage(response.data.message)

    } catch (error) {

      if (error.response?.data) {

        const data = error.response.data


        if (data.username) {

          setError(data.username[0])

        } else if (data.email) {

          setError(data.email[0])

        } else if (data.message) {

          setError(data.message)

        } else {

          setError('Registration failed')

        }

      } else {

        setError(
          'Unable to connect to the server'
        )

      }

    }

  }


  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOTP = async (e) => {

    e.preventDefault()

    setError('')
    setMessage('')


    if (otp === '') {

      setError('Please enter the OTP')

      return

    }


    try {

      const response = await api.post(
        '/verify-otp/',
        {
          email,
          otp
        }
      )


      setMessage(response.data.message)


      setTimeout(() => {

        navigate('/login')

      }, 1000)


    } catch (error) {

      if (error.response?.data?.message) {

        setError(
          error.response.data.message
        )

      } else {

        setError(
          'OTP verification failed'
        )

      }

    }

  }


  return (

    <>

      {/* =========================
          NAVBAR
          ========================= */}

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


          <div className="d-flex gap-2">

            <button
              className="btn btn-outline-light"
              onClick={() => navigate('/')}
            >
              Home
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => navigate('/login')}
            >
              Login
            </button>

          </div>

        </div>

      </nav>


      {/* =========================
          MAIN CONTENT
          ========================= */}

      <div className="container mt-5">

        {!showOTP ? (

          <div className="auth-form">

            <h2>Register</h2>


            <form onSubmit={handleRegister}>

              {/* USERNAME */}

              <input
                className="form-control mb-3"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />


              {/* EMAIL */}

              <input
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />


              {/* PASSWORD */}

              <div className="password-wrapper">

                <input
                  className="form-control"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (

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

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />

                    </svg>

                  )}

                </button>

              </div>


              {/* RE-ENTER PASSWORD */}

              <div className="password-wrapper">

                <input
                  className="form-control"
                  type={
                    showRePassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Re-enter Password"
                  value={rePassword}
                  onChange={(e) =>
                    setRePassword(e.target.value)
                  }
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowRePassword(
                      !showRePassword
                    )
                  }
                  aria-label={
                    showRePassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showRePassword ? (

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

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />

                    </svg>

                  )}

                </button>

              </div>


              {error && (

                <div className="text-danger mb-3">

                  {error}

                </div>

              )}


              <button
                className="btn btn-dark w-100"
                type="submit"
              >
                Register
              </button>

            </form>


            <div className="text-center mt-4">

              <span>
                Already have an account?{' '}
              </span>

              <button
                className="auth-link"
                onClick={() =>
                  navigate('/login')
                }
              >
                Login
              </button>

            </div>

          </div>

        ) : (

          /* OTP CARD */

          <div className="otp-card">

            <h2>
              Verify your email
            </h2>

            <p className="text-muted">
              We sent a verification code to
            </p>

            <p>
              <strong>{email}</strong>
            </p>

            <form
              onSubmit={handleVerifyOTP}
              className="mt-4"
            >

              <input
                className="form-control otp-input"
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />


              {error && (

                <div className="text-danger mt-3">

                  {error}

                </div>

              )}


              {message && (

                <div className="text-success mt-3">

                  {message}

                </div>

              )}


              <button
                className="btn btn-dark w-100 mt-3"
                type="submit"
              >
                Verify OTP
              </button>

            </form>

          </div>

        )}

      </div>

    </>

  )
}

export default Register