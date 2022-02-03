import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../Copyright';
import { SnackBarContext } from '../Snackbar'
import Loader from '../Loader';
import { jwtManager } from '../../helper/jwtManager'

const theme = createTheme();

export default function SignIn() {
    const { showMsg } = useContext(SnackBarContext)
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        const formData = new FormData(event.currentTarget);
        let data = {
            username: formData.get('username'),
            password: formData.get('password'),
            captcha: formData.get('captcha'),
        }
        console.log(data);
        try {
            let res = await axios.post('/user/login', data)
            console.log(res.data)
            if (res.data.success) {
                jwtManager.set(res.data.token)
            }
            else showMsg({ ...res.data })
        } catch (e) { showMsg({ status: 'error', message: 'Oops! something went wrong!' }) }
        finally {
            setLoading(false)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {loading && <Loader />}
            <Container component="main" maxWidth="xs">
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
                    <Typography component="h1" variant="h5">
                        Sign in
          </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="captcha"
                            label="Captcha"
                            name="captcha"
                            autoComplete="captcha"
                            autoFocus
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
            </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}