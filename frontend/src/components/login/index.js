import React, { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import axios from 'axios'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../Copyright'
import { SnackBarContext } from '../Snackbar'
import Loader from '../Loader'
import { jwtManager } from '../../helper/jwtManager'
import { useNavigate } from 'react-router-dom'
import Captcha from './Captcha'
import { strictNonEmptyObjectValues } from '../../helper/utils'

const theme = createTheme()

export default function SignIn() {
  const { showMsg } = useContext(SnackBarContext)
  const [loading, setLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(false)
  const navigate = useNavigate()
  const validated = (data) => {
    let fields = {
      username: data.get('username'),
      password: data.get('password'),
      captcha: data.get('captcha'),
    }
    let isValidFields = strictNonEmptyObjectValues(fields)
    if (fields.captcha !== captchaValue || !isValidFields) {
      showMsg({
        status: 'error',
        message: !isValidFields ? 'All fields required!' : 'Invalid Captcha!',
      })
      return false
    } else return fields
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      let data = validated(formData)
      if (data) {
        let res = await axios.post('/user/login', data)
        setLoading(false)
        if (res.data.success) {
          if (jwtManager.set(res.data.token, res.data.data)) {
            setLoading(false)
            navigate('/', { replace: true })
          }
        } else showMsg({ ...res.data })
      } else {
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
      showMsg({ status: 'error', message: 'Oops! something went wrong!' })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {loading && <Loader />}
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='User Name'
              name='username'
              autoComplete='username'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Captcha getCaptchaValue={(v) => setCaptchaValue(v)} />
            <TextField
              margin='normal'
              required
              fullWidth
              id='captcha'
              label='Captcha'
              name='captcha'
              autoComplete='captcha'
              //   autoFocus
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
