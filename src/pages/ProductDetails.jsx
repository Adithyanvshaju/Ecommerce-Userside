import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContent'
import './ProductDetails.css'
import { useWishlist } from '../contexts/WishlistContext'


function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()


  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }

    addToCart(product, quantity)
    navigate('/cart')
  }

  if (!product) return <p className="text-center mt-5">Loading...</p>
  const handleWishlist = () => {
  if (!user) {
    navigate('/login')
    return
  }
  addToWishlist(product)
}


  return (
    <div className="container mt-5 product-details">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.category}</p>
          <h4>${product.price}</h4>
          <p>{product.description}</p>

          <div className="quantity-box">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

         <div className="d-flex gap-3 mt-3">
  <button
    className="btn btn-dark"
    onClick={handleAddToCart}
  >
    Add to Cart
  </button>

  <button
    className="btn btn-outline-danger"
    onClick={handleWishlist}
  >
    Add to Wishlist
  </button>
</div>


        </div>
      </div>
    </div>
  )
}

export default ProductDetails
