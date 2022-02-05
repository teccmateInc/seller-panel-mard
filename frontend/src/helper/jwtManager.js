import Cookies from 'js-cookie'
import {
  TOKEN_COOKIE_KEY,
  TOKEN_LOCAL_STORAGE_KEY,
  USER_LOCAL_STORAGE_KEY,
} from './constants'

const createJwtManager = () => {
  const get = () => {
    return {
      jwtToken: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY),
      cookieToken: Cookies.get(TOKEN_COOKIE_KEY),
    }
  }
  const getUser = () => JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY))

  const set = async (token, user) => {
    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token)
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    Cookies.set(TOKEN_COOKIE_KEY, token)
    return true
  }

  const clear = () => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
    Cookies.remove(TOKEN_COOKIE_KEY)
    return true
  }

  return {
    set,
    get,
    getUser,
    clear,
  }
}

export const jwtManager = createJwtManager()
