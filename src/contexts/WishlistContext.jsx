import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {

  const { user } = useAuth()

  const [wishlist, setWishlist] = useState([])


  // =========================
  // GET WISHLIST
  // =========================

  const fetchWishlist = async () => {

    try {

      const response = await api.get('/wishlist/')

      const wishlistData = response.data.map(item => ({
        ...item.product,
        wishlistItemId: item.id
      }))

      setWishlist(wishlistData)

    } catch (error) {

      console.error(
        'Wishlist error:',
        error.response?.data || error.message
      )

      // Keep wishlist empty if backend request fails
      setWishlist([])

    }

  }


  // =========================
  // LOGIN / LOGOUT
  // =========================

  useEffect(() => {

    if (!user) {

      setWishlist([])

      return

    }

    fetchWishlist()

  }, [user])


  // =========================
  // ADD TO WISHLIST
  // =========================

  const addToWishlist = async (product) => {

    try {

      await api.post('/wishlist/add/', {
        product: product.id
      })

      await fetchWishlist()

    } catch (error) {

      console.error(
        'Add wishlist error:',
        error.response?.data || error.message
      )

    }

  }


  // =========================
  // REMOVE FROM WISHLIST
  // =========================

  const removeFromWishlist = async (id) => {

    try {

      await api.delete(`/wishlist/${id}/`)

      await fetchWishlist()

    } catch (error) {

      console.error(
        'Remove wishlist error:',
        error.response?.data || error.message
      )

    }

  }


  // =========================
  // CHECK WISHLIST
  // =========================

  const isInWishlist = (id) => {

    return wishlist.some(item => item.id === id)

  }


  // =========================
  // CLEAR WISHLIST
  // =========================

  const clearWishlist = async () => {

    try {

      for (const item of wishlist) {

        await api.delete(`/wishlist/${item.id}/`)

      }

      setWishlist([])

    } catch (error) {

      console.error(
        'Clear wishlist error:',
        error.response?.data || error.message
      )

    }

  }


  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >

      {children}

    </WishlistContext.Provider>

  )

}


export const useWishlist = () => useContext(WishlistContext)