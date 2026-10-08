import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const OrdersContext = createContext()

export const OrdersProvider = ({ children }) => {

  const { user } = useAuth()
  const [orders, setOrders] = useState([])


  // =====================================
  // GET ORDERS FROM DJANGO
  // =====================================

  const fetchOrders = async () => {

    try {

      const response = await api.get('/orders/')

      setOrders(response.data)

    } catch (error) {

      console.error(
        'Orders error:',
        error.response?.data || error.message
      )

      setOrders([])

    }

  }


  // =====================================
  // LOGIN / LOGOUT
  // =====================================

  useEffect(() => {

    if (user) {

      fetchOrders()

    } else {

      setOrders([])

    }

  }, [user])


  // =====================================
  // REFRESH ORDERS
  // =====================================

  const refreshOrders = () => {

    if (user) {
      fetchOrders()
    }

  }


  return (

    <OrdersContext.Provider
      value={{
        orders,
        refreshOrders
      }}
    >

      {children}

    </OrdersContext.Provider>

  )

}


export const useOrders = () => useContext(OrdersContext)