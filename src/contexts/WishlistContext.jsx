import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`wishlist_${user.id}`)
      setWishlist(stored ? JSON.parse(stored) : [])
    } else {
      setWishlist([])
    }
  }, [user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `wishlist_${user.id}`,
        JSON.stringify(wishlist)
      )
    }
  }, [wishlist, user])

  const addToWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id)
    if (!exists) {
      setWishlist([...wishlist, product])
    }
  }

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id)
  }

  const clearWishlist = () => setWishlist([])

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
