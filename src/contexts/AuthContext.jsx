import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)


  // =========================
  // CHECK USER WHEN APP LOADS
  // =========================

  useEffect(() => {

    const accessToken = sessionStorage.getItem('access')
    const refreshToken = sessionStorage.getItem('refresh')

    if (accessToken && refreshToken) {
      setUser(true)
    }

    setLoading(false)

  }, [])


  // =========================
  // LOGIN
  // =========================

  const login = (tokens) => {

    sessionStorage.setItem(
      'access',
      tokens.access
    )

    sessionStorage.setItem(
      'refresh',
      tokens.refresh
    )

    setUser(true)

  }


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    sessionStorage.removeItem('access')
    sessionStorage.removeItem('refresh')

    setUser(null)

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {!loading && children}

    </AuthContext.Provider>

  )

}


export const useAuth = () =>
  useContext(AuthContext)