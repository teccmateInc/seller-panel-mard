import React, { useEffect, useState } from 'react'
import './App.css'
import SignIn from './components/login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { jwtManager } from './helper/jwtManager'
import Main from './components/main'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material'
import Loader from './components/Loader'

const theme = createTheme()

function App() {
  let navigate = useNavigate()
  let [loading,setLoading] = useState(true)
  useEffect(() => {
    let { jwtToken: token, cookieToken } = jwtManager.get()
    if (!token) navigate('/login', { replace: true })
    setLoading(false)
  }, [])
  return (
    <>
      <ThemeProvider theme={theme}>
        {loading ? <Loader/> :
        <Routes>
          <Route path='login' element={<SignIn />} />
          <Route path='/*' element={<Main />} />
        </Routes>
        }
      </ThemeProvider>
    </>
  )
}

export default App
