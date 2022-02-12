import React from 'react'
import { CircularProgress, Backdrop } from '@mui/material'
import { makeStyles } from '@mui/styles'

let useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1401,
    color: '#fff',
  },
}))

const Loader = ({ classes }) => {
  let _classes = useStyles()
  return (
    <Backdrop className={classes?.backdrop || _classes.backdrop} open={true}>
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}

export default Loader
