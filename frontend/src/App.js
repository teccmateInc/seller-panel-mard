import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import SignIn from './components/login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { jwtManager } from './helper/jwtManager'
import Header from './components/header'
import ChangePassword from './components/changePassword'
import Main from './components/main'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material'

const theme = createTheme()

function App() {
  let navigate = useNavigate()
  useEffect(() => {
    let { jwtToken: token, cookieToken } = jwtManager.get()
    if (!token) navigate('/login', { replace: true })
  }, [])
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path='login' element={<SignIn />} />
          <Route path='/*' element={<Main />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
