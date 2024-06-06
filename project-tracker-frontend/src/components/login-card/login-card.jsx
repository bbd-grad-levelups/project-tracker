import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import '../../index.css';
import logo from "../../assets/project-logo.png";
import LoginButton from '../buttons/login-button';

const ThemedBox = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="md"
            sx={{
                mt: 5,
                p: 5,
                pt: 4,
                borderRadius: "15px",
                backgroundColor: theme.palette.thirdly.main,
                color: theme.palette.text.primary,
                display: 'flex',
                placeItems: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
            }}
        >
            <img src={logo} alt='login-symbol' style={{ height: 13 + 'rem', mixBlendMode: 'unset', marginTop: 10 }}></img>
            <Typography variant='h5' sx={{ mt: 5, mb: 3 }}>Welcome to</Typography>
            <Typography variant='h4' style={{ fontWeight: 'bold' }} sx={{ mb: 5 }}>Project-Tracker!</Typography>
            <LoginButton />
        </Container>
    );
};

export default ThemedBox;