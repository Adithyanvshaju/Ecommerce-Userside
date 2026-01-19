import React, { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContent'
import { useWishlist } from '../contexts/WishlistContext'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

function Products() {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)


  const [toast, setToast] = useState('')


  const [priceOrder, setPriceOrder] = useState('')

  const productsPerPage = 8
  const location = useLocation()
  const navigate = useNavigate()

  const { user } = useAuth()
  const { addToCart, cart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const search = new URLSearchParams(location.search).get('search')
  const gender = new URLSearchParams(location.search).get('gender')

  useEffect(() => {
    api.get('/products')
      .then(res => {
        let data = res.data

        
        if (search) {
          data = data.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
        }
        if (gender) {
          data = data.filter(
            p => p.gender.toLowerCase() === gender.toLowerCase()
          )
        }
        if (priceOrder === 'low') {
          data = [...data].sort((a, b) => a.price - b.price)
        }

        if (priceOrder === 'high') {
          data = [...data].sort((a, b) => b.price - a.price)
        }

        setProducts(data)
        setCurrentPage(1)
      })
      .catch(err => console.error(err))
  }, [search, gender, priceOrder])

  const indexOfLast = currentPage * productsPerPage
  const indexOfFirst = indexOfLast - productsPerPage
  const currentProducts = products.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(products.length / productsPerPage)

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    addToCart(product, 1)
    setToast('Added to cart')
    setTimeout(() => setToast(''), 2000)
  }
  const handleWishlist = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      setToast('Removed from wishlist')
    } else {
      addToWishlist(product)
      setToast('Added to wishlist')
    }

    setTimeout(() => setToast(''), 2000)
  }

  const isInCart = (id) => {
    return cart.some(item => item.id === id)
  }

  return (
    <div className="container mt-4 position-relative">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Shoes</h2>

        <div className="dropdown">
          <button
            className="btn btn-outline-dark dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Filter by Price
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setPriceOrder('low')}
              >
                Price: Low to High
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => setPriceOrder('high')}
              >
                Price: High to Low
              </button>
            </li>

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={() => setPriceOrder('')}
              >
                Clear Filter
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        {currentProducts.map(product => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100 position-relative">

              <button
                className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                onClick={(e) => handleWishlist(e, product)}
              >
                {isInWishlist(product.id)
                  ? <FaHeart size={18} color="red" />
                  : <FaRegHeart size={18} />}
              </button>

              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                />

                <div className="card-body">
                  <h5>{product.name}</h5>
                  <p className="text-muted">{product.category}</p>
                  <p className="fw-bold">${product.price}</p>
                </div>
              </Link>

              <div className="px-3 pb-3">
                {isInCart(product.id) ? (
                  <button
                    className="btn btn-outline-dark w-100"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/cart')
                    }}
                  >
                    View Cart
                  </button>
                ) : (
                  <button
                    className="btn btn-dark w-100"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-4 shadow"
          style={{ zIndex: 1050 }}
        >
          {toast}
        </div>
      )}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  )
}

export default Products
