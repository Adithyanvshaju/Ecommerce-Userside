import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    const res = await api.get(
      `/users?email=${email}&password=${password}`
    )

    if (res.data.length === 0) {
      setError('Invalid email or password')
      return
    }

    setError('')
    login(res.data[0])
    navigate('/')
  }

  return (
    <div className="container mt-5">
      <div className="w-50 mx-auto p-4 border rounded shadow-sm">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="text-danger mb-3">{error}</div>}

          <button className="btn btn-dark w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
