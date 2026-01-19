import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../contexts/WishlistContext'


function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()

  if (wishlist.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h4>Your wishlist is empty..</h4>
        <Link to="/products" className="btn btn-dark mt-3">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-5" >
      <h2 className="mb-4">My Wishlist</h2>

      <div className="row">
        {wishlist.map(item => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100">

              <div
                role="button"
                onClick={() => navigate(`/product/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                />

                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p>${item.price}</p>
                </div>
              </div>

              <div className="card-footer bg-white border-0">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromWishlist(item.id)
                  }}
                >
                  Remove
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
