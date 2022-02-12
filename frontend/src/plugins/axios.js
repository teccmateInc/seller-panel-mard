import axios from 'axios'
import { jwtManager } from '../helper/jwtManager'

// Add a request interceptor
export default function configAxios() {
  axios.defaults.baseURL =
    'https://btc-seller.herokuapp.com/api/'
  // process.env.REACT_APP_API || 'http://localhost:5000/api/'
  axios.interceptors.request.use(
    (config) => {
      const { jwtToken: token, cookieToken } = jwtManager.get()
      if (token) {
        config.headers['authorization'] = token
        config.headers['cookies'] = cookieToken
      }
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )
}
