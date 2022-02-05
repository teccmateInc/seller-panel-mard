import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../Copyright'
import { strictNonEmptyObjectValues } from '../../helper/utils'
import { SnackBarContext } from '../Snackbar'
import Loader from '../Loader'
import axios from 'axios'

const theme = createTheme()

export default function ChangePassword() {
  const { showMsg } = React.useContext(SnackBarContext)
  const [loading, setLoading] = React.useState(false)

  const validated = (data) => {
    let fields = {
      newpassword: data.get('newpassword'),
      password: data.get('password'),
    }
    return strictNonEmptyObjectValues(fields) ? fields : false
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const formdata = new FormData(event.currentTarget)
    // eslint-disable-next-line no-console
    try {
      let validData = validated(formdata)
      if (validData) {
        let { data } = await axios.post('/user/update-password', validData)
        if (data) showMsg(data)
      } else {
        showMsg({ status: 'error', message: 'All fields required!' })
      }
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! Something went wrong.' })
    } finally {
      setLoading(false)
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
            Change Password
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
              name='newpassword'
              label='New Password'
              type='password'
              id='newpassword'
              autoComplete='current-password'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Confirm Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
