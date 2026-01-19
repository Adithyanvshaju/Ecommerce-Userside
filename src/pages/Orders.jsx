import React from 'react'
import { useOrders } from '../contexts/OrdersContext'

function Orders() {
  const { orders } = useOrders()

  if (orders.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h3>No orders yet</h3>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h2>My Orders</h2>

      {orders.map(order => (
        <div key={order.id} className="border p-3 mb-3">
          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Total:</strong> ${order.total}</p>

          {order.items.map(item => (
            <div key={item.id} className="d-flex mb-2">
              <img src={item.image} width="60" />
              <div className="ms-3">
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Orders
