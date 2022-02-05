import React, { useContext, useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { PAGES } from '../../helper/constants'
import axios from 'axios'
import Loader from '../Loader'
import { SnackBarContext } from '../Snackbar'
import { jwtManager } from '../../helper/jwtManager'

const Header = ({ children }) => {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const { showMsg } = useContext(SnackBarContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(null)
  const [username, setUsername] = useState('')
  let {jwtToken} = jwtManager.get()
  
  useEffect(() => {
    if (!jwtToken || jwtToken === 'undefined') navigate('/login', { replace: true })
    else {
      let { username, type } = jwtManager.getUser()
      console.log(username)
      setType(type)
      setUsername(username)
    }
  }, [jwtToken,username])

  let pages =
    type === 'admin'
      ? [
        ...PAGES,
        { title: 'Create User', url: 'create-user' },
        { title: 'Users', url: 'all-users' },
      ]
      : PAGES

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (url) => {
    setAnchorElNav(null)
    navigate(url)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const createNewUser = () => {
    handleCloseUserMenu()
    if (type === 'admin') {
      navigate('create-user')
    }
  }

  const logoutUser = async () => {
    setLoading(true)
    handleCloseUserMenu()
    try {
      let { data } = await axios.get('/user/logout')

      setLoading(false)
      showMsg(data)
      if (data.success) {
        jwtManager.clear()
        navigate('/login', { replace: true })
      }
    } catch (e) {
      setLoading(false)
      showMsg({ status: 'error', message: 'Oops! Something went wrong.' })
    }
  }

  return (
    <>
      {loading && <Loader />}
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              BTC Seller
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map(({ url, title }, i) => (
                  <MenuItem key={i} onClick={() => handleCloseNavMenu(url)}>
                    <Typography textAlign='center'>{title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map(({ url, title }, i) => (
                <Button
                  key={i}
                  onClick={() => handleCloseNavMenu(url)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {title}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='More Options'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={username.charAt(0).toLocaleUpperCase()}
                    src='/static/images/avatar/2.jpg'
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {type === 'admin' && (
                  <MenuItem onClick={createNewUser}>
                    <Typography textAlign='center'>Create User</Typography>
                  </MenuItem>
                )}
                {['Logout'].map((setting) => (
                  <MenuItem key={setting} onClick={logoutUser}>
                    <Typography textAlign='center'>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </>
  )
}
export default Header
