import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
})


// =====================================
// ADD ACCESS TOKEN TO EVERY REQUEST
// =====================================

api.interceptors.request.use(
  (config) => {

    const accessToken = sessionStorage.getItem('access')

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


// =====================================
// AUTOMATICALLY REFRESH ACCESS TOKEN
// =====================================

api.interceptors.response.use(
  (response) => {

    // Normal successful response
    return response
  },

  async (error) => {

    const originalRequest = error.config

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/login/') &&
      !originalRequest.url.includes('/token/refresh/')
    ) {

      originalRequest._retry = true

      const refreshToken = sessionStorage.getItem('refresh')

      // No refresh token available
      if (!refreshToken) {

        sessionStorage.clear()
        window.location.href = '/login'

        return Promise.reject(error)
      }

      try {

        // Ask Django for a new access token
        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          {
            refresh: refreshToken
          }
        )

        const newAccessToken = response.data.access

        // Save the new access token
        sessionStorage.setItem(
          'access',
          newAccessToken
        )

        // Add new token to the failed request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        // Try the original request again
        return api(originalRequest)

      } catch (refreshError) {

        // Refresh token is also invalid/expired
        console.error(
          'Token refresh failed:',
          refreshError.response?.data ||
          refreshError.message
        )

        sessionStorage.clear()

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)


export default api