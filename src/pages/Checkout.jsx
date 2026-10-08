import React, { useState } from 'react'
import { useCart } from '../contexts/CartContent'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Checkout() {

  const { cart } = useCart()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  )


  // =========================
  // LOAD RAZORPAY
  // =========================

  const loadRazorpay = () => {

    return new Promise((resolve) => {

      const script = document.createElement('script')

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => resolve(true)

      script.onerror = () => resolve(false)

      document.body.appendChild(script)

    })

  }


  // =========================
  // PAYMENT
  // =========================

  const handlePayment = async () => {

    if (
      !address ||
      !city ||
      !postalCode ||
      !country
    ) {

      setError(
        'Please fill in all shipping address fields'
      )

      return

    }

    if (cart.length === 0) {

      setError('Your cart is empty')

      return

    }

    try {

      setLoading(true)
      setError('')


      // CREATE DJANGO ORDER

      const orderResponse = await api.post(
  '/orders/create/'
)

console.log('ORDER RESPONSE:', orderResponse.data)

const orderId =
  orderResponse.data.order_id ||
  orderResponse.data.id

if (!orderId) {
  setError('Order was created, but Order ID was not received')
  setLoading(false)
  return
}


      // LOAD RAZORPAY

      const razorpayLoaded =
        await loadRazorpay()

      if (!razorpayLoaded) {

        setError(
          'Razorpay failed to load. Please try again.'
        )

        setLoading(false)

        return

      }


      // CREATE RAZORPAY ORDER

      const paymentResponse = await api.post(
        '/payment/create/',
        {
          order_id: orderId
        }
      )

      const paymentData =
        paymentResponse.data


      // RAZORPAY OPTIONS

      const options = {

        key: paymentData.key_id,

        amount: paymentData.amount,

        currency: paymentData.currency,

        name: 'New Balance',

        description: 'New Balance Order',

        order_id:
          paymentData.razorpay_order_id,


        handler: async function (response) {

          try {

            await api.post(
              '/payment/verify/',
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature
              }
            )


            setSuccess(true)
            setLoading(false)


            setTimeout(() => {

              navigate('/orders')

            }, 1500)


          } catch (error) {

            console.error(
              'Payment verification error:',
              error.response?.data || error
            )

            setError(
              error.response?.data?.error ||
              'Payment verification failed'
            )

            setLoading(false)

          }

        },


        prefill: {
          name: '',
          email: ''
        },


        theme: {
          color: '#198754'
        }

      }


      const razorpay =
        new window.Razorpay(options)

      razorpay.open()


      razorpay.on(
        'payment.failed',
        function (response) {

          console.error(
            'Payment failed:',
            response.error
          )

          setError(
            response.error?.description ||
            'Payment failed. Please try again.'
          )

          setLoading(false)

        }
      )


    } catch (error) {

      console.error(
        'Checkout error:',
        error.response?.data || error
      )

      setError(
        error.response?.data?.error ||
        'Something went wrong while creating the order'
      )

      setLoading(false)

    }

  }


  return (

    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6f6f6'
      }}
    >

      <Navbar />


      <div className="container py-5">

        {/* PAGE TITLE */}

        <div className="mb-4">

          <h2 className="fw-bold mb-1">
            Checkout
          </h2>

          <p className="text-muted mb-0">
            Complete your order
          </p>

        </div>


        <div className="row g-4">


          {/* =================================
              LEFT SIDE
              ================================= */}

          <div className="col-lg-7">


            {/* SHIPPING ADDRESS */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  1. Delivery Address
                </h5>


                {/* ADDRESS */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Address
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="House name, street, area"
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                  />

                </div>


                {/* CITY + POSTAL */}

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      City
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                    />

                  </div>


                  <div className="col-md-6 mb-3">

                    <label className="form-label fw-semibold">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(e.target.value)
                      }
                    />

                  </div>

                </div>


                {/* COUNTRY */}

                <div className="mb-2">

                  <label className="form-label fw-semibold">
                    Country
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Country"
                    value={country}
                    onChange={(e) =>
                      setCountry(e.target.value)
                    }
                  />

                </div>


                {error && (

                  <div className="alert alert-danger mt-3 mb-0">
                    {error}
                  </div>

                )}

              </div>

            </div>


            {/* PAYMENT */}

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-3">
                  2. Payment
                </h5>

                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: '#f8f9fa'
                  }}
                >

                  <div className="d-flex align-items-center">

                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '42px',
                        height: '42px'
                      }}
                    >
                      ₹
                    </div>

                    <div>

                      <div className="fw-semibold">
                        Secure Online Payment
                      </div>

                      <small className="text-muted">
                        Payment securely processed by Razorpay
                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              RIGHT SIDE
              ================================= */}

          <div className="col-lg-5">

            <div
              className="card border-0 shadow-sm"
              style={{
                position: 'sticky',
                top: '20px'
              }}
            >

              <div className="card-body p-4">


                <h5 className="fw-bold mb-4">
                  Order Summary
                </h5>


                {/* PRODUCTS */}

                <div>

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="d-flex align-items-center mb-3"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '65px',
                          height: '65px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />


                      <div className="ms-3 flex-grow-1">

                        <div className="fw-semibold">
                          {item.name}
                        </div>

                        <small className="text-muted">
                          Qty: {item.quantity}
                        </small>

                      </div>


                      <div className="fw-semibold">

                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}

                      </div>

                    </div>

                  ))}

                </div>


                <hr />


                {/* SUBTOTAL */}

                <div className="d-flex justify-content-between mb-2">

                  <span className="text-muted">
                    Subtotal
                  </span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>

                </div>


                {/* SHIPPING */}

                <div className="d-flex justify-content-between mb-2">

                  <span className="text-muted">
                    Shipping
                  </span>

                  <span className="text-success">
                    FREE
                  </span>

                </div>


                <hr />


                {/* TOTAL */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <span className="fw-bold fs-5">
                    Total
                  </span>

                  <span className="fw-bold fs-5">
                    ₹{total.toFixed(2)}
                  </span>

                </div>


                {/* PAY BUTTON */}

                <button
                  className="btn btn-dark w-100 py-3 fw-semibold"
                  onClick={handlePayment}
                  disabled={
                    cart.length === 0 ||
                    loading
                  }
                >

                  {loading
                    ? 'Processing...'
                    : `Pay ₹${total.toFixed(2)}`
                  }

                </button>


                <div className="text-center mt-3">

                  <small className="text-muted">
                    🔒 Secure checkout
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* SUCCESS */}

        {success && (

          <div
            className="alert alert-success position-fixed top-0 end-0 m-4 shadow"
            style={{
              zIndex: 1050
            }}
          >

            ✅ Payment Successful!

          </div>

        )}

      </div>

    </div>

  )

}

export default Checkout