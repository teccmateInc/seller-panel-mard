import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Payment from '@mui/icons-material/Payment'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../Copyright'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { SnackBarContext } from '../Snackbar'
import Loader from '../Loader'
import { useNavigate } from 'react-router-dom'
import { strictNonEmptyObjectValues } from '../../helper/utils'
import axios from 'axios'

const theme = createTheme()

const Payout = () => {
  const [addCustomAmount, setCustomAmount] = React.useState(false)
  const navigate = useNavigate()
  const { showMsg } = React.useContext(SnackBarContext)
  const [loading, setLoading] = React.useState(false)

  const validated = (data) => {
    let fields = {
      paymentmethod: data.get('paymentmethod'),
      payment_type: data.get('payment_type'),
      btcaddress: data.get('btcaddress'),
    }
    if (fields.payment_type === 'custom') {
      fields = { ...fields, amount: data.get('amount') }
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
        let { data } = await axios.post('/pay', validData)
        setLoading(false)
        if (data) showMsg(data)
        if (data.success) navigate('/')
      } else {
        setLoading(false)
        showMsg({ status: 'error', message: 'All fields required!!' })
      }
    } catch (e) {
      showMsg({ status: 'error', message: 'Oops! Something went wrong.' })
      setLoading(false)
    }
  }

  const handleAmountType = (e) => {
    if (e.target.value === 'custom') setCustomAmount(true)
    else if (addCustomAmount) setCustomAmount(false)
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
            <Payment />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Payout
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            <FormControl fullWidth margin='normal'>
              <InputLabel id='payment-method'>Payment Method</InputLabel>
              <Select
                labelId='payment-method'
                id='payment-method'
                name='paymentmethod'
                // value={age}
                defaultValue=''
                label='Payment Method'
              >
                <MenuItem value={'BTC'}>BTC</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <InputLabel id='payment-type'>Amount To Pay</InputLabel>
              <Select
                labelId='payment-type'
                id='payment-type'
                name='payment_type'
                // value={age}
                onChange={handleAmountType}
                defaultValue=''
                label='Payment Type'
              >
                <MenuItem value={'Full Amount'}>Full Amount</MenuItem>
                <MenuItem value={'custom'}>Specific Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin='normal'
              required
              fullWidth
              name='btcaddress'
              label='BTC Address'
              type='text'
              id='btcaddress'
            />
            {addCustomAmount && (
              //minimum amount is 200
              <TextField
                margin='normal'
                required
                fullWidth
                name='amount'
                label='Enter Amount'
                type='number'
                id='amount'
              />
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Pay
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default Payout
