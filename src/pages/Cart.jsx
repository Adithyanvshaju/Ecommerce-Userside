import React from 'react'
import { useCart } from '../contexts/CartContent'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Cart() {

  const {
    cart,
    removeFromCart,
    updateQuantity
  } = useCart()

  const { user } = useAuth()

  const navigate = useNavigate()


  // =========================
  // EMPTY CART
  // =========================

  if (!user || cart.length === 0) {

    return (

      <div>

        <Navbar />

        <div className="container mt-5">

          <div
            className="text-center p-5 bg-white shadow-sm rounded"
            style={{ minHeight: '400px' }}
          >

            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              style={{
                width: '120px',
                marginBottom: '20px'
              }}
            />

            <h3 className="mb-2">
              Missing Cart items?
            </h3>

            <p className="text-muted">
              Login to see the items you added previously
            </p>

            <button
              className="btn btn-dark px-5 mt-3"
              onClick={() => navigate('/Products')}
            >
              Browse Products
            </button>

          </div>

        </div>

      </div>

    )

  }


  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )


  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">
          Your Cart
        </h2>


        {/* CART ITEMS */}

        {cart.map(item => (

          <div
            key={item.id}
            className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3"
          >

            {/* PRODUCT IMAGE */}

            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover'
              }}
            />


            {/* PRODUCT DETAILS */}

            <div className="flex-grow-1 ms-3">

              <h5>
                {item.name}
              </h5>

              <p>
                ₹{item.price}
              </p>

            </div>


            {/* QUANTITY */}

            <div>

              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity - 1
                  )
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>

              <span className="mx-2">
                {item.quantity}
              </span>

              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity + 1
                  )
                }
              >
                +
              </button>

            </div>


            {/* REMOVE */}

            <button
              className="btn btn-danger ms-3"
              onClick={() =>
                removeFromCart(item.id)
              }
            >
              Remove
            </button>

          </div>

        ))}


        {/* TOTAL */}

        <h4 className="text-end mt-4">
          Total: ₹{total.toFixed(2)}
        </h4>


        {/* CHECKOUT */}

        <div className="text-end mt-3">

          <button
            className="btn btn-success px-4"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>

  )

}

export default Cart