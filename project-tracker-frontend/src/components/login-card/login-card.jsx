import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import '../../index.css';
import LoginButton from '../buttons/login-button';

const ThemedBox = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: '40rem',
                height: '35rem',
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '5%',
                color: theme.palette.text.primary,
                margin: 'auto',
                position: 'relative',
                display: 'flex',
                // place-items: center,
                // flex-direction: column,
                // justify-content: center,
                // align-items: center,
                placeItems: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
            }}
        >
            <img src='.\src\assets\project-logo.png' alt='login-symbol' style={{ height: 13 + 'rem', mixBlendMode: 'unset', marginTop: 10 }}></img>
            <h2>Welcome to</h2>
            <h1> Project-Tracker!</h1>
            <LoginButton />
        </Box>
    );
};

export default ThemedBox;