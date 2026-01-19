import React, { useState } from 'react'
import { useCart } from '../contexts/CartContent'
import { useOrders } from '../contexts/OrdersContext'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const { cart, clearCart } = useCart()
  const { addOrder } = useOrders()
  const navigate = useNavigate()


  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handlePayment = () => {
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping address fields')
      return
    }

    setError('')

    const order = {
      id: Date.now(),
      items: cart,
      total,
      shippingAddress: {
        address,
        city,
        postalCode,
        country
      },
      date: new Date().toLocaleString()
    }

    addOrder(order)
    clearCart()
    setSuccess(true)

  
    setTimeout(() => {
      navigate('/orders')
    }, 2000)
  }

  return (
    <div className="container mt-5 position-relative">
      <h2>Checkout</h2>

      <div className="mb-4">
        <h5>Shipping Address</h5>

        <input
          className="form-control mb-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        {error && <div className="text-danger">{error}</div>}
      </div>

      <p>
        Total Amount: <strong>${total.toFixed(2)}</strong>
      </p>

      <button
        className="btn btn-success"
        onClick={handlePayment}
        disabled={cart.length === 0}
      >
        Pay Now
      </button>

   
      {success && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-4 shadow"
          style={{ zIndex: 1050 }}
        >
          ✅ Payment Successful!
        </div>
      )}
    </div>
  )
}

export default Checkout
