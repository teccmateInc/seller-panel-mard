import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const SnackBarContext = React.createContext()

export default function SnackBarProvider({ children }) {
  const [popup, setOptions] = React.useState({ open: false })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOptions({ open: false })
  }

  const showMsg = (
    defaultOpts = {
      message: '',
      status: 'success',
    }
  ) => {
    setOptions({
      ...defaultOpts,
      position: {
        vertical: 'top',
        horizontal: 'right',
      },
      open: true,
    })
  }

  return (
    <SnackBarContext.Provider
      value={{
        showMsg,
      }}
    >
      {popup.open && (
        <Snackbar
          open={popup.open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={popup.position}
        >
          <Alert
            onClose={handleClose}
            severity={popup.status}
            sx={{ width: '100%' }}
          >
            {popup.message}
          </Alert>
        </Snackbar>
      )}
      {children}
    </SnackBarContext.Provider>
  )
}
