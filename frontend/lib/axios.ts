import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add request interceptor to add token to all requests
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor to handle token refresh
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If error is unauthorized and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Redirect to login if no token
                if (!localStorage.getItem('token')) {
                    window.location.href = '/login'
                    return Promise.reject(error)
                }

                // Try original request again
                return instance(originalRequest)
            } catch (error) {
                // If refresh failed, redirect to login
                localStorage.removeItem('token')
                window.location.href = '/login'
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export default instance