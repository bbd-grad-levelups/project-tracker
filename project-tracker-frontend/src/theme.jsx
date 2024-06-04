import { createTheme, responsiveFontSizes } from '@mui/material';

const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: 'rgb(30,30,30)'
        }
    }
}));

const lightTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'light'
    }
}));

export { darkTheme, lightTheme };