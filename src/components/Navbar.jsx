import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useCart } from '../contexts/CartContent'
import { useWishlist } from '../contexts/WishlistContext'
import { useAuth } from '../contexts/AuthContext'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import api from '../services/api'

function Navbar() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const navigate = useNavigate()

  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()

  const cartCount = cart.length
  const wishlistCount = wishlist.length


  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data)
    })
  }, [])


  useEffect(() => {
    if (!query.trim()) {
      setFiltered([])
      return
    }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )

    setFiltered(matches)
  }, [query, products])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/products?search=${encodeURIComponent(query)}`)
    setQuery('')
    setFiltered([])
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar" style={{ position: "sticky", zIndex: 1 }}>
      <div className="container position-relative">

       <Link className="navbar-brand d-flex align-items-center gap-2" to="/"> 
       <svg width="40" height="40" viewBox="0 0 100 100"> 
        <path d="M20 80 V20 L50 60 V20 H60 V80 H50 L20 40 V80 Z" fill="white" /> 
        <path d="M65 20 H85 C92 20 92 35 85 40 C92 45 92 60 85 60 H65 V20 Z" fill="white" /> 
        </svg> <span className="brand-text">NEW BALANCE</span> 
        </Link>
        <div className="position-relative navbar-search">

          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search shoes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"/>
            <button type="submit">Search</button>
          </form>

           {filtered.length > 0 && (
            <div className="position-absolute bg-white shadow w-100"
              style={{ top: "100%", zIndex: 999 }}>
              {filtered.map(product => (
                <div key={product.id}
                  className="px-3 py-2 border-bottom search-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => { navigate(`/product/${product.id}`)
                    setQuery('')
                    setFiltered([])}}>
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav gap-lg-3 align-items-lg-center">

            <li className="nav-item">
              <Link className="nav-link text-white" to="/products">SNKRS</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item position-relative">
                  <Link className="nav-link text-white" to="/cart">
                    <FaShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="nav-item position-relative">
                  <Link className="nav-link text-white" to="/wishlist">
                    <FaHeart size={20} />
                    {wishlistCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
                    <li className="nav-item">
              <Link className="nav-link text-white" to="/orders">ORDERS</Link>
            </li>


                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/register">Register</Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
