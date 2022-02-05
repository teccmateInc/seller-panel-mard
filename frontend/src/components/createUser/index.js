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
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../Copyright'
import { SnackBarContext } from '../Snackbar'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import { strictNonEmptyObjectValues } from '../../helper/utils'
import axios from 'axios'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const theme = createTheme()

export default function CreateUser() {
  const { showMsg } = useContext(SnackBarContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const validated = (data) => {
    let fields = {
      username: data.get('username'),
      password: data.get('password'),
      usertype: data.get('usertype'),
    }
    let isValidFields = strictNonEmptyObjectValues(fields)
    if (!isValidFields) {
      showMsg({ status: 'error', message: 'All fields required!' })
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
        let res = await axios.post('/admin/create-user', data)
        setLoading(false)
        if (res.data) {
          showMsg({ ...res.data })
          res.data.success && navigate('/all-users')
        }
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
            Create New User
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
            <FormControl fullWidth margin='normal'>
              <InputLabel id='usertype'>User Type</InputLabel>
              <Select
                labelId='usertype'
                id='usertype'
                name='usertype'
                defaultValue=''
                label='Payment Type'
              >
                <MenuItem value={'admin'}>Admin</MenuItem>
                <MenuItem value={'seller'}>Seller</MenuItem>
                <MenuItem value={'buyer'}>Buyer</MenuItem>
              </Select>
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Create User
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
