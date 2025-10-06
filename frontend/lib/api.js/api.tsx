// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// class ApiClient {
//   constructor() {
//     this.baseURL = API_BASE_URL
//     this.token = null
//   }

//   setToken(token) {
//     this.token = token
//   }

//   getToken() {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('authToken')
//     }
//     return null
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`
//     const token = this.getToken()

//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     }

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     try {
//       const response = await fetch(url, config)
//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || `HTTP error! status: ${response.status}`)
//       }

//       return data
//     } catch (error) {
//       console.error('API request failed:', error)
//       throw error
//     }
//   }