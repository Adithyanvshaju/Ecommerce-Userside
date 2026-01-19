import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const {user,login} =useAuth()
  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[user,navigate])

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

  const handleRegister = async (e) => {
    e.preventDefault()

    if (username.length < 6) {
      setError('Username must be at least 6 characters')
      return
    }
    if (username.trim() === "") {
      setError("Input cannot be empty");
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    if (!strongPasswordRegex.test(password)) {
      setError('Password must contain letters and numbers')
      return
    }

    if (password !== rePassword) {
      setError('Passwords do not match')
      return
    }

    await api.post('/users', {
      username,
      email,
      password
    })

    setError('')
    navigate('/login')
  }

  return (
    <div className="container mt-5">
      <div className="w-50 mx-auto p-4 border rounded shadow-sm">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Re-enter Password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />

          {error && <div className="text-danger mb-3">{error}</div>}

          <button className="btn btn-dark w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
