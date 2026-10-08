import React from 'react'
import { useOrders } from '../contexts/OrdersContext'
import Navbar from '../components/Navbar'

function Orders() {

  const { orders } = useOrders()


  // =====================================
  // NO ORDERS
  // =====================================

  if (orders.length === 0) {

    return (

      <div>

        <Navbar />

        <div className="container text-center mt-5">

          <h3>No orders yet</h3>

          <p className="text-muted">
            Your purchased orders will appear here.
          </p>

        </div>

      </div>

    )

  }


  return (

    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">
          My Orders
        </h2>


        {orders.map(order => (

          <div
            key={order.id}
            className="card border-0 shadow-sm mb-4"
          >

            <div className="card-body">


              {/* ORDER HEADER */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                  <h5 className="mb-1">
                    Order #{order.id}
                  </h5>

                  <small className="text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </small>

                </div>


                <span
                  className={`badge ${
                    order.status === 'paid'
                      ? 'bg-success'
                      : 'bg-warning text-dark'
                  }`}
                >
                  {order.status}
                </span>

              </div>


              <hr />


              {/* ORDER ITEMS */}

              {order.items?.map(item => (

                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3"
                >

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    width="70"
                    height="70"
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />


                  <div className="ms-3 flex-grow-1">

                    <h6 className="mb-1">
                      {item.product.name}
                    </h6>

                    <p className="text-muted mb-1">
                      Qty: {item.quantity}
                    </p>

                    <p className="mb-0">
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                  </div>

                </div>

              ))}


              <hr />


              {/* ORDER TOTAL */}

              <div className="d-flex justify-content-between">

                <strong>
                  Total
                </strong>

                <strong>
                  ₹{Number(order.total_amount).toFixed(2)}
                </strong>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}

export default Orders